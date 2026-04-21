'use strict';

/**
 * default controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::default.default');
