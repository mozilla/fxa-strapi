'use strict';

/**
 * access controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::access.access');
