'use strict';

/**
 * relying-party service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::relying-party.relying-party');
