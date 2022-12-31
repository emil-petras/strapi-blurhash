'use strict';

module.exports = ({ strapi }) => {

  const generateBlurhash = async (event) => {
    const { data } = event.params;
    if (data.mime && data.mime.startsWith('image/')) {
      data.blurhash = await strapi.plugin('strapi-blurhash').service('blurhash').generateBlurhash(data.url);
    }
  };

  strapi.db.lifecycles.subscribe({
    models: ['plugin::upload.file'],
    beforeCreate: generateBlurhash,
    beforeUpdate: generateBlurhash,
  });
};
