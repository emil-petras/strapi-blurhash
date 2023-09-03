import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({
  async exportAll(ctx) {
    ctx.body = await strapi
      .plugin('strapi-blurhash')
      .service('blurhash')
      .regenerateAllBlurhashes();

    ctx.send({
      message: 'All blurhashes successfuly regenerated',
    });
  },
});
