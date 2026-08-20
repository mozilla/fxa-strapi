'use strict';

const { errors } = require('@strapi/utils');

const SUBGROUP_UID = 'api::subgroup.subgroup';
const OFFERING_UID = 'api::offering.offering';

const isPlainObject = (v) =>
  v !== null && typeof v === 'object' && !Array.isArray(v);

const directIds = (value) => {
  if (value === null || value === undefined) return [];
  if (Array.isArray(value)) return value.flatMap(directIds);
  if (typeof value === 'string' || typeof value === 'number') {
    return [String(value)];
  }
  if (!isPlainObject(value)) return [];

  const id = value.documentId ?? value.id;
  return id === null || id === undefined ? [] : [String(id)];
};

const idForms = (doc) => {
  if (!isPlainObject(doc)) return [];
  const forms = [];
  if (doc.documentId != null) forms.push(String(doc.documentId));
  if (doc.id != null) forms.push(String(doc.id));
  return forms;
};

const resolveOfferingIds = (entry, savedIds) => {
  const value = entry.offering;
  if (value === undefined) return savedIds;
  if (value === null) return [];

  const isDelta =
    isPlainObject(value) &&
    value.documentId === undefined &&
    value.id === undefined;
  if (!isDelta) return directIds(value);

  if (Array.isArray(value.set)) return directIds(value.set);

  const connected = directIds(value.connect);
  if (connected.length > 0) return connected;

  const disconnected = new Set(directIds(value.disconnect));
  return savedIds.some((id) => disconnected.has(id)) ? [] : savedIds;
};

const resolveMembershipIds = (data, savedGroups) => {
  const value = data.offerings;
  if (value === undefined) return savedGroups.flat();
  if (value === null) return [];

  const isDelta =
    isPlainObject(value) &&
    value.documentId === undefined &&
    value.id === undefined;
  if (!isDelta) return directIds(value);

  if (Array.isArray(value.set)) return directIds(value.set);

  const disconnected = new Set(directIds(value.disconnect));
  const kept = savedGroups.filter(
    (aliases) => !aliases.some((id) => disconnected.has(id))
  );
  return [...kept.flat(), ...directIds(value.connect)];
};

const savedSubgroup = async (strapi, documentId) => {
  const subgroup = documentId
    ? await strapi.documents(SUBGROUP_UID).findOne({
        documentId,
        status: 'draft',
        populate: {
          offerings: true,
          rankedOfferings: { populate: { offering: true } },
        },
      })
    : null;

  const identifiers = new Map();
  const remember = (offering) => {
    if (!isPlainObject(offering) || !offering.apiIdentifier) return;
    for (const form of idForms(offering)) {
      identifiers.set(form, offering.apiIdentifier);
    }
  };

  const entries = new Map();
  for (const entry of subgroup?.rankedOfferings ?? []) {
    remember(entry.offering);
    entries.set(String(entry.id), {
      offeringIds: idForms(entry.offering),
      position: entry.position,
    });
  }
  for (const offering of subgroup?.offerings ?? []) {
    remember(offering);
  }

  return {
    entries,
    identifiers,
    offeringGroups: (subgroup?.offerings ?? []).map(idForms),
  };
};

const resolveRankedOfferings = (data, saved) =>
  data.rankedOfferings.flatMap((entry, row) => {
    if (!isPlainObject(entry)) return [];
    const savedEntry = saved.entries.get(String(entry.id));
    return [
      {
        entry,
        row,
        offeringIds: resolveOfferingIds(entry, savedEntry?.offeringIds ?? []),
        position:
          entry.position === undefined ? savedEntry?.position : entry.position,
      },
    ];
  });

const offeringIdentifiers = async (strapi, ids) => {
  const identifiers = new Map();
  if (ids.length === 0) return identifiers;

  for (const key of ['documentId', 'id']) {
    const pending = ids.filter((id) => !identifiers.has(id));
    if (pending.length === 0) break;
    try {
      const offerings = await strapi.documents(OFFERING_UID).findMany({
        filters: { [key]: { $in: pending } },
        fields: ['apiIdentifier'],
        status: 'draft',
      });
      for (const offering of offerings ?? []) {
        for (const form of idForms(offering)) {
          identifiers.set(form, offering.apiIdentifier);
        }
      }
    } catch (e) {
      strapi.log.debug(
        `Could not look up offerings by ${key} to label a subgroup: ${e.message}`
      );
    }
  }

  return identifiers;
};

const resolveIdentifiers = async (strapi, resolved, saved) => {
  const unnamedIds = [
    ...new Set(
      resolved
        .flatMap(({ offeringIds }) => offeringIds)
        .filter((id) => !saved.identifiers.has(id))
    ),
  ];
  return new Map([
    ...saved.identifiers,
    ...(await offeringIdentifiers(strapi, unnamedIds)),
  ]);
};

const identifierOf = (offeringIds, identifiers) =>
  offeringIds.map((id) => identifiers.get(id)).find(Boolean);

const describeEntry = ({ offeringIds, row }, identifiers) => {
  const apiIdentifier = identifierOf(offeringIds, identifiers);
  return apiIdentifier ? `"${apiIdentifier}"` : `the entry in row ${row + 1}`;
};

const sentence = (message) =>
  message.charAt(0).toUpperCase() + message.slice(1);

const noOffering = (entries, name) =>
  entries.map(
    (entry) => `${name(entry)} has no offering — choose one, or remove the entry`
  );

const noPosition = (entries, name) =>
  entries
    .filter(({ position }) => position === null || position === undefined)
    .map((entry) => `${name(entry)} has no position — every offering needs one`);

const duplicateOfferings = (entries, name, keyOf) => {
  const invalid = [];
  const seenKeys = new Set();
  const seenAliases = [];

  for (const entry of entries) {
    const key = keyOf(entry);
    const clash =
      (key !== undefined && seenKeys.has(key)) ||
      seenAliases.some((ids) => entry.offeringIds.some((id) => ids.has(id)));
    if (clash) {
      invalid.push(
        `${name(entry)} appears more than once — an offering can only hold one position in a subgroup`
      );
      continue;
    }
    if (key !== undefined) seenKeys.add(key);
    seenAliases.push(new Set(entry.offeringIds));
  }

  return invalid;
};

const duplicatePositions = (entries, name) => {
  const invalid = [];
  const takenBy = new Map();

  for (const entry of entries) {
    const { position } = entry;
    if (position === null || position === undefined) continue;
    if (takenBy.has(position)) {
      invalid.push(
        `${name(entry)} and ${takenBy.get(position)} are both at position ${position} — every offering needs its own`
      );
      continue;
    }
    takenBy.set(position, name(entry));
  }

  return invalid;
};

const notMembers = (entries, memberIds, name) =>
  entries
    .filter(({ offeringIds }) => !offeringIds.some((id) => memberIds.has(id)))
    .map(
      (entry) =>
        `${name(entry)} is not one of this subgroup's offerings — add it to the offerings list first, then give it a position`
    );

const collectInvalidRankedOfferings = (resolved, data, saved, identifiers) => {
  const name = (entry) => describeEntry(entry, identifiers);
  const keyOf = (entry) => identifierOf(entry.offeringIds, identifiers);
  const withOffering = resolved.filter(({ offeringIds }) => offeringIds.length);
  const withoutOffering = resolved.filter(
    ({ offeringIds }) => !offeringIds.length
  );
  const memberIds = new Set(resolveMembershipIds(data, saved.offeringGroups));

  return [
    ...noOffering(withoutOffering, name),
    ...noPosition(withOffering, name),
    ...duplicateOfferings(withOffering, name, keyOf),
    ...duplicatePositions(withOffering, name),
    ...notMembers(withOffering, memberIds, name),
  ];
};

const applyLabels = (resolved, identifiers) => {
  for (const { entry, offeringIds, position } of resolved) {
    const apiIdentifier = identifierOf(offeringIds, identifiers);
    if (!apiIdentifier) continue;
    entry.generatedLabel =
      position === null || position === undefined
        ? apiIdentifier
        : `${position} · ${apiIdentifier}`;
  }
};

module.exports = (strapi) => async (context, next) => {
  if (
    context.uid !== SUBGROUP_UID ||
    (context.action !== 'create' && context.action !== 'update')
  ) {
    return next();
  }

  const data = context.params?.data;
  if (!Array.isArray(data?.rankedOfferings)) return next();

  const saved = await savedSubgroup(strapi, context.params?.documentId);
  const resolved = resolveRankedOfferings(data, saved);
  const identifiers = await resolveIdentifiers(strapi, resolved, saved);

  const invalid = collectInvalidRankedOfferings(
    resolved,
    data,
    saved,
    identifiers
  );
  if (invalid.length > 0) {
    throw new errors.ValidationError(
      `This subgroup's order can't be saved. ${invalid
        .map(sentence)
        .join('. ')}.`
    );
  }

  applyLabels(resolved, identifiers);

  return next();
};
