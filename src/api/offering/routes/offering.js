'use strict';

/**
 * offering router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::offering.offering');
