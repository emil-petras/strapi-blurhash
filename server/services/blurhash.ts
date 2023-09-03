import { Strapi } from '@strapi/strapi';

import { getPlaiceholder } from 'plaiceholder';

export default ({ strapi }: { strapi: Strapi }) => ({
  async generateBlurhash(url: string) {
    try {
      return (await getPlaiceholder(url)).blurhash.hash;
    } catch (e) {
      strapi.log.error(e);
      return null;
    }
  },
});
