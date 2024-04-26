'use strict';

const { getAbsoluteServerUrl } = require('@strapi/utils');

module.exports = ({ strapi }) => {
  const generateBlurhash = async (event, eventType) => {
    const { data, where } = event.params;

    if ((data.mime && data.mime.startsWith('image/'))) {
      let fullUrl = "";
      if (data.url.startsWith('http')) {
        fullUrl = data.url;
      } else {
        fullUrl = `${getAbsoluteServerUrl(strapi.config)}${data.url}`;
      }
      data.blurhash = await strapi.plugin('strapi-blurhash').service('blurhash').generateBlurhash(fullUrl);
    }

    if (eventType === 'beforeUpdate') {
      const regenerateOnUpdate = strapi.plugin('strapi-blurhash').config('regenerateOnUpdate');
      const forceRegenerateOnUpdate = strapi.plugin('strapi-blurhash').config('forceRegenerateOnUpdate');
    
      const fullData = await strapi.db.query('plugin::upload.file').findOne({
        select: ['url', 'blurhash', 'name', 'mime'],
        where
      });
    
      if (fullData.mime.startsWith('image/') && (forceRegenerateOnUpdate || (!fullData.blurhash && regenerateOnUpdate))) {
        let fullDataUrl = "";
        if (fullData.url.startsWith('http')) {
          fullDataUrl = fullData.url;
        } else {
          fullDataUrl = `${getAbsoluteServerUrl(strapi.config)}${fullData.url}`;
        }
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
