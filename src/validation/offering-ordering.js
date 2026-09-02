'use strict';

const { errors } = require('@strapi/utils');

const OFFERING_UID = 'api::offering.offering';
const SUBGROUP_UID = 'api::subgroup.subgroup';

const SUBGROUP_LIMIT = 500;

const isPlainObject = (v) =>
  v !== null && typeof v === 'object' && !Array.isArray(v);

const idForms = (doc) => {
  if (!isPlainObject(doc)) return [];
  const forms = [];
  if (doc.documentId != null) forms.push(String(doc.documentId));
  if (doc.id != null) forms.push(String(doc.id));
  return forms;
};

const rankedSubgroups = (strapi, status) =>
  strapi.documents(SUBGROUP_UID).findMany({
    status,
    limit: SUBGROUP_LIMIT,
    populate: { rankedOfferings: { populate: { offering: true } } },
  });

const heldPositions = (subgroup, documentId) =>
  (subgroup.rankedOfferings ?? [])
    .filter((entry) => idForms(entry.offering).includes(documentId))
    .map((entry) => entry.position);

const nameOf = (subgroup) =>
  subgroup.internalName ?? subgroup.groupName ?? subgroup.documentId;

const describeHolders = (holders) =>
  [...holders.entries()]
    .map(
      ([name, positions]) =>
        `position ${[...positions].sort((a, b) => a - b).join(', ')} in "${name}"`
    )
    .join(', ');

module.exports = (strapi) => async (context, next) => {
  const { action } = context;
  if (
    context.uid !== OFFERING_UID ||
    (action !== 'delete' && action !== 'unpublish')
  ) {
    return next();
  }

  const documentId = context.params?.documentId;
  if (!documentId) return next();

  const subgroups = [
    ...(await rankedSubgroups(strapi, 'draft')),
    ...(await rankedSubgroups(strapi, 'published')),
  ];

  const holders = new Map();
  for (const subgroup of subgroups) {
    const held = heldPositions(subgroup, documentId);
    if (held.length === 0) continue;
    const positions = holders.get(nameOf(subgroup)) ?? new Set();
    for (const position of held) positions.add(position);
    holders.set(nameOf(subgroup), positions);
  }

  if (holders.size > 0) {
    const offering = await strapi.documents(OFFERING_UID).findOne({
      documentId,
      status: 'draft',
      fields: ['apiIdentifier'],
    });
    throw new errors.ValidationError(
      `"${offering?.apiIdentifier ?? documentId}" can't be ${
        action === 'delete' ? 'deleted' : 'unpublished'
      } — it still holds ${describeHolders(
        holders
      )}. Remove those ranked offerings first.`
    );
  }

  return next();
};
