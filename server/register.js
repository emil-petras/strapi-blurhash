'use strict';

module.exports = ({ strapi }) => {
  strapi.plugin('upload').contentTypes.file.attributes.blurhash = {
    type: 'text',
  };
};
