'use strict';

/**
 * iap service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::iap.iap');
