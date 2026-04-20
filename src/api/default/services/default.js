'use strict';

/**
 * default service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::default.default');
