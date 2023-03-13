'use strict';

module.exports = ({ strapi }) => {

  const generateBlurhash = async (event) => {
    const { data, where } = event.params;

    if ((data.mime && data.mime.startsWith('image/'))) {
      data.blurhash = await strapi.plugin('strapi-blurhash').service('blurhash').generateBlurhash(data.url);
    }

    if (strapi.plugin('strapi-blurhash').config('regenerateOnUpdate') === true) {
      const fullData = await strapi.db.query('plugin::upload.file').findOne({
        select: ['url', 'blurhash', 'name', 'mime'],
        where
      })

      if ((fullData.mime && fullData.mime.startsWith('image/')) && !fullData.blurhash) {
        data.blurhash = await strapi.plugin('strapi-blurhash').service('blurhash').generateBlurhash(fullData.url);
      }
    }
  };

  strapi.db.lifecycles.subscribe({
    models: ['plugin::upload.file'],
    beforeCreate: generateBlurhash,
    beforeUpdate: generateBlurhash,
  });
};
