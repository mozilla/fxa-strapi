'use strict';

/**
 * relying-party router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::relying-party.relying-party');
