'use strict';

module.exports = ({ strapi }) => {
  const generateBlurhash = async (event, eventType) => {
    console.log(`generating blurhash for ${eventType} event`);
    const { data, where } = event.params;

    const host = strapi.config.get('server.host', 'defaultHost');
    const port = strapi.config.get('server.port', 1337);
    console.log(`server config - host: ${host}, port: ${port}`);

    // Use the thumbnail instead for faster processing (10+ MB images could take around 40-60s)
    // TODO: add config to choose what format to use (with fallbacks)
    const url = data.formats?.thumbnail?.url || data.url;

    if ((data.mime && data.mime.startsWith('image/'))) {
      let fullUrl = "";
      if (data.url.startsWith('http')) {
        fullUrl = data.url;
      } else {
        fullUrl = `${"http://" + host + ":" + port}${data.url}`;
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
        select: ['url', 'blurhash', 'name', 'mime'],
        where
      });
      console.log(`found existing file: ${fullData.name}`);
    
      if (fullData.mime.startsWith('image/') && (forceRegenerateOnUpdate || (!fullData.blurhash && regenerateOnUpdate))) {
        let fullDataUrl = "";
        if (fullData.url.startsWith('http')) {
          fullDataUrl = fullData.url;
        } else {
          fullDataUrl = `${"http://" + host + ":" + port}${fullData.url}`;;
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
