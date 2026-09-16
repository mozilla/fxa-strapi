'use strict';

const { errors } = require('@strapi/utils');

function validateWindow(data) {
  if (data.windowKind === undefined) {
    return;
  }
  if (data.windowKind === 'calendar') {
    if (!data.windowPeriod) {
      throw new errors.ValidationError('windowPeriod is required for calendar meters');
    }
    return;
  }
  if (!data.windowDurationMinutes) {
    throw new errors.ValidationError(`windowDurationMinutes is required for ${data.windowKind} meters`);
  }
}

module.exports = {
  beforeCreate(event) {
    validateWindow(event.params.data);
  },
  async beforeUpdate(event) {
    const current = await strapi.db
      .query(event.model.uid)
      .findOne({ where: event.params.where });
    if (!current) {
      return;
    }
    validateWindow({ ...current, ...event.params.data });
  },
};
