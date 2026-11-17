'use strict';

const { errors } = require('@strapi/utils');

const SLIDING_WINDOW_STEP_MINUTES = 60;

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
  if (data.windowKind === 'sliding' && data.windowDurationMinutes % SLIDING_WINDOW_STEP_MINUTES !== 0) {
    throw new errors.ValidationError(`windowDurationMinutes must be a multiple of ${SLIDING_WINDOW_STEP_MINUTES} for sliding meters`);
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
