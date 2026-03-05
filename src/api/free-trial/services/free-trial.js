'use strict';

/**
 * free-trial service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::free-trial.free-trial');
