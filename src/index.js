'use strict';

const { errors } = require('@strapi/utils');

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

module.exports = {
  register(/*{ strapi }*/) {},

  bootstrap({ strapi }) {
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
  },
};
