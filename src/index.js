'use strict';

const crypto = require('crypto');

const { errors } = require('@strapi/utils');

const offeringOrdering = require('./validation/offering-ordering');
const subgroupOrdering = require('./validation/subgroup-ordering');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const ACCESS_UID = 'api::access.access';

const normalizeEmail = (e) =>
  typeof e === 'string' ? e.trim().toLowerCase() : e;

const isValidEmail = (e) => typeof e === 'string' && EMAIL_RE.test(e);

const isPlainObject = (v) =>
  v !== null && typeof v === 'object' && !Array.isArray(v);

const isValidDate = (s) => {
  if (typeof s !== 'string' || !DATE_RE.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && s === d.toISOString().slice(0, 10);
};

const normalizeMatchers = (matchers) => {
  if (!Array.isArray(matchers)) return matchers;

  return matchers.map((m) => {
    if (m.__component !== 'matchers.email-list') return m;

    let emails = m.emails;
    if (typeof emails === 'string') {
      try {
        emails = JSON.parse(emails);
      } catch (_e) {
        return m;
      }
    }
    if (!isPlainObject(emails)) return { ...m, emails };

    const normalized = {};
    for (const [email, value] of Object.entries(emails)) {
      const key = normalizeEmail(email);
      if (key) normalized[key] = value;
    }
    return { ...m, emails: normalized };
  });
};

const collectInvalidEntries = (matchers) => {
  if (!Array.isArray(matchers)) return [];
  const invalid = [];

  matchers.forEach((m, i) => {
    if (m.__component !== 'matchers.email-list') return;
    if (m.emails === undefined || m.emails === null) return;

    if (!isPlainObject(m.emails)) {
      invalid.push(
        `matchers[${i}].emails: must be a JSON object keyed by email address`
      );
      return;
    }

    for (const [email, value] of Object.entries(m.emails)) {
      const path = `matchers[${i}].emails["${email}"]`;
      if (!isValidEmail(email)) {
        invalid.push(`${path}: invalid email address`);
      }
      if (!Array.isArray(value)) {
        invalid.push(`${path}: value must be an array of strings`);
        continue;
      }
      if (value.length < 1 || value.length > 2) {
        invalid.push(`${path}: array must have 1 or 2 entries`);
        continue;
      }
      if (!isValidDate(value[0])) {
        invalid.push(`${path}[0]: expiration must be "YYYY-MM-DD"`);
      }
      if (value.length === 2 && typeof value[1] !== 'string') {
        invalid.push(`${path}[1]: comment must be a string`);
      }
    }
  });

  return invalid;
};

// Local POC seed for end-to-end metering testing. The salt never leaves
// Strapi: we hash a known plaintext with the configured API_TOKEN_SALT at boot
// and store only the hash, exactly as Strapi's admin api-token service would.
// The same plaintext is handed to payments-api via STRAPI_CLIENT_CONFIG__API_KEY.
const METERING_POC_TOKEN = 'metering-poc-local-token';
const METERING_POC_TOKEN_NAME = 'metering-poc';

const SEED_METERS = [
  {
    slug: 'api_calls',
    unit: 'calls',
    limit: 1000,
    window: 'monthly',
    notificationThresholds: '80,100',
    webhooks: [],
  },
  {
    slug: 'api_calls_wh',
    unit: 'calls',
    limit: 1000,
    window: 'monthly',
    notificationThresholds: '80,100',
    webhooks: [
      {
        url: 'https://9099--main--fxa2--julianpoyourow.coder.tartarus.cloud/webhook',
        signingClientId: 'local-rp',
      },
    ],
  },
];

async function ensureApiToken(strapi) {
  const salt = strapi.config.get('admin.apiToken.salt');
  const accessKey = crypto
    .createHmac('sha512', salt)
    .update(METERING_POC_TOKEN)
    .digest('hex');

  const existing = await strapi.db
    .query('admin::api-token')
    .findOne({ where: { name: METERING_POC_TOKEN_NAME } });

  const data = {
    name: METERING_POC_TOKEN_NAME,
    description: 'Local POC token for payments-api metering meter lookups',
    type: 'full-access',
    accessKey,
    lifespan: null,
    expiresAt: null,
  };

  if (existing) {
    await strapi.db
      .query('admin::api-token')
      .update({ where: { id: existing.id }, data });
  } else {
    await strapi.db.query('admin::api-token').create({ data });
  }
  strapi.log.info(`[metering-poc] api token "${METERING_POC_TOKEN_NAME}" ready`);
}

async function ensureSeedMeter(strapi, meter) {
  const existing = await strapi
    .documents('api::meter.meter')
    .findFirst({ filters: { slug: meter.slug } });

  if (existing) {
    await strapi.documents('api::meter.meter').update({
      documentId: existing.documentId,
      data: meter,
      status: 'published',
    });
    strapi.log.info(`[metering-poc] updated published meter "${meter.slug}"`);
    return;
  }

  await strapi
    .documents('api::meter.meter')
    .create({ data: meter, status: 'published' });
  strapi.log.info(`[metering-poc] seeded published meter "${meter.slug}"`);
}

module.exports = {
  register(/*{ strapi }*/) {},

  async bootstrap({ strapi }) {
    strapi.documents.use(async (context, next) => {
      if (
        context.uid !== ACCESS_UID ||
        (context.action !== 'create' && context.action !== 'update')
      ) {
        return next();
      }

      const data = context.params?.data;
      if (!data?.matchers) return next();

      data.matchers = normalizeMatchers(data.matchers);

      const invalid = collectInvalidEntries(data.matchers);
      if (invalid.length > 0) {
        throw new errors.ValidationError(
          `Invalid email list entries: ${invalid.join('; ')}`
        );
      }

      return next();
    });

    strapi.documents.use(subgroupOrdering(strapi));
    strapi.documents.use(offeringOrdering(strapi));

    try {
      await ensureApiToken(strapi);
      for (const meter of SEED_METERS) {
        await ensureSeedMeter(strapi, meter);
      }
    } catch (err) {
      strapi.log.error(`[metering-poc] bootstrap failed: ${err.message}`);
    }
  },
};
