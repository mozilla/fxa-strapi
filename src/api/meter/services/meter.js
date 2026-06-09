'use strict';

/**
 * meter service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::meter.meter');
