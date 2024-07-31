'use strict';

/**
 * purchase service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::purchase.purchase');
