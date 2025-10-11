'use strict';

module.exports = ({ strapi }) => {
  const findSmallestFormat = (formats) => {
      if (!formats || Object.values(formats).length === 0) {
          return null;
      }
      return Object.values(formats).reduce((a, b) => (a.height*a.width < b.height*b.width ? a : b));
  }

  const generateBlurhash = async (event, eventType) => {
    console.log(`generating blurhash for ${eventType} event`);
    const { data, where } = event.params;

    const host = strapi.config.get('server.host', 'defaultHost');
    const port = strapi.config.get('server.port', 1337);
    console.log(`server config - host: ${host}, port: ${port}`);

    const useSmallestFormat = strapi.plugin('strapi-blurhash').config('useSmallestFormat');
    const dataBestUrl = (useSmallestFormat ? findSmallestFormat(data.formats)?.url : null) || data.url;

    if ((data.mime && data.mime.startsWith('image/'))) {
      let fullUrl = "";
      if (dataBestUrl.startsWith('http')) {
        fullUrl = dataBestUrl;
      } else {
        fullUrl = `${"http://" + host + ":" + port}${dataBestUrl}`;
      }
      console.log(`generating blurhash for image: ${fullUrl}`);
      data.blurhash = await strapi.plugin('strapi-blurhash').service('blurhash').generateBlurhash(fullUrl);
      console.log(`blurhash generated successfully: ${data.blurhash}`);
    }

    if (eventType === 'beforeUpdate') {
      const regenerateOnUpdate = strapi.plugin('strapi-blurhash').config('regenerateOnUpdate');
      const forceRegenerateOnUpdate = strapi.plugin('strapi-blurhash').config('forceRegenerateOnUpdate');
      console.log(`update config - regenerateOnUpdate: ${regenerateOnUpdate}, forceRegenerateOnUpdate: ${forceRegenerateOnUpdate}`);
    
      const fullData = await strapi.db.query('plugin::upload.file').findOne({
        select: ['url', 'blurhash', 'name', 'mime', 'formats'],
        where
      });
      console.log(`found existing file: ${fullData.name}`);

      if (fullData.mime.startsWith('image/') && (forceRegenerateOnUpdate || (!fullData.blurhash && regenerateOnUpdate))) {
        const fullDataBestUrl = (useSmallestFormat ? findSmallestFormat(fullData.formats)?.url : null) || fullData.url;
        let fullDataUrl = "";
        if (fullDataBestUrl.startsWith('http')) {
          fullDataUrl = fullDataBestUrl;
        } else {
          fullDataUrl = `${"http://" + host + ":" + port}${fullDataBestUrl}`;
        }
        console.log(`regenerating blurhash for image: ${fullDataUrl}`);
        data.blurhash = await strapi.plugin('strapi-blurhash').service('blurhash').generateBlurhash(fullDataUrl);
        console.log(`blurhash regenerated successfully: ${data.blurhash}`);
      }
    }    
  };

  strapi.db.lifecycles.subscribe({
    models: ['plugin::upload.file'],
    beforeCreate: (event) => generateBlurhash(event, 'beforeCreate'),
    beforeUpdate: (event) => generateBlurhash(event, 'beforeUpdate'),
  });
  console.log('strapi-blurhash plugin bootstrap completed');
};
