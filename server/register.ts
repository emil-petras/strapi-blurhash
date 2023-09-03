import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => {
  strapi.plugin('upload').contentTypes.file.attributes.blurhash = {
    type: 'text',
  };
};
