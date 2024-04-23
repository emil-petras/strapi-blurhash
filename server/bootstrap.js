'use strict';

const { getAbsoluteServerUrl } = require('@strapi/utils');

module.exports = ({ strapi }) => {
  const generateBlurhash = async (event, eventType) => {
    const { data, where } = event.params;

    if ((data.mime && data.mime.startsWith('image/'))) {
      const fullUrl = `${getAbsoluteServerUrl(strapi.config)}${data.url}`;
      data.blurhash = await strapi.plugin('strapi-blurhash').service('blurhash').generateBlurhash(fullUrl);
    }

    if (eventType === 'beforeUpdate' && strapi.plugin('strapi-blurhash').config('regenerateOnUpdate') === true) {
      const fullData = await strapi.db.query('plugin::upload.file').findOne({
        select: ['url', 'blurhash', 'name', 'mime'],
        where
      })

      if ((fullData.mime && fullData.mime.startsWith('image/')) && !fullData.blurhash) {
        const fullDataUrl = `${getAbsoluteServerUrl(strapi.config)}${fullData.url}`;
        data.blurhash = await strapi.plugin('strapi-blurhash').service('blurhash').generateBlurhash(fullDataUrl);
      }
    }
  };

  strapi.db.lifecycles.subscribe({
    models: ['plugin::upload.file'],
    beforeCreate: (event) => generateBlurhash(event, 'beforeCreate'),
    beforeUpdate: (event) => generateBlurhash(event, 'beforeUpdate'),
  });
};
