'use strict';

/**
 * churn-intervention service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::churn-intervention.churn-intervention');
