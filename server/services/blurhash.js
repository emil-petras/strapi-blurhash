'use strict';

const { getPlaiceholder } = require('plaiceholder');

module.exports = ({ strapi }) => ({
  async generateBlurhash(url) {
    try {
      return (await getPlaiceholder(url)).blurhash.hash;
    } catch (e) {
      strapi.log.error(e);
      return null;
    }
  },
});
