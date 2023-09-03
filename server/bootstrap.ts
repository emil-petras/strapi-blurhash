import { Action, Event } from '@strapi/database/lib/lifecycles';
import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => {
  const generateBlurhash = async (event: Event, eventType: Action) => {
    const { data, where } = event.params;

    if (data.mime && data.mime.startsWith('image/')) {
      data.blurhash = await strapi
        .plugin('strapi-blurhash')
        .service('blurhash')
        .generateBlurhash(data.url);
    }

    if (
      eventType === 'beforeUpdate' &&
      strapi.plugin('strapi-blurhash').config('regenerateOnUpdate') === true
    ) {
      const fullData = await strapi.db.query('plugin::upload.file').findOne({
        select: ['url', 'blurhash', 'name', 'mime'],
        where,
      });

      if (
        fullData.mime &&
        fullData.mime.startsWith('image/') &&
        !fullData.blurhash
      ) {
        data.blurhash = await strapi
          .plugin('strapi-blurhash')
          .service('blurhash')
          .generateBlurhash(fullData.url);
      }
    }
  };

  strapi.db.lifecycles.subscribe({
    // TODO: Remove this @ts-ignore
    // @ts-ignore
    models: ['plugin::upload.file'],
    beforeCreate: (event) => generateBlurhash(event, 'beforeCreate'),
    beforeUpdate: (event) => generateBlurhash(event, 'beforeUpdate'),
  });
};
