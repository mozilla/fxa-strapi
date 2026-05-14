'use strict';

/**
 * access service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::access.access');
