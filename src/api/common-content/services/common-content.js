'use strict';

/**
 * common-content service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::common-content.common-content');
