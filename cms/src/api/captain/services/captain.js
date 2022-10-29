'use strict';

/**
 * captain service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::captain.captain');
