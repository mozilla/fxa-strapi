'use strict';

/**
 * offering service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::offering.offering');
