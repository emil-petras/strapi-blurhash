const { encode } = require('blurhash');
const webp = require('webp-wasm');
const { createCanvas, loadImage } = require('canvas');

module.exports = ({ strapi }) => ({
  async generateBlurhash(url) {
    try {
      const fetchModule = await import('node-fetch');
      const fetch = fetchModule.default;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const isWebP = url.endsWith('.webp');

      let imageData;
      if (isWebP) {
        try {
          const decoded = await webp.decode(buffer);
          imageData = {
            width: decoded.width,
            height: decoded.height,
            data: Buffer.from(decoded.data),
          };
        } catch (error) {
          strapi.log.error(`Failed to decode WebP image: ${error.message}`);
          throw error;
        }
      } else {
        try {
          const img = await loadImage(buffer);
          const canvas = createCanvas(img.width, img.height);
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const imageDataObject = ctx.getImageData(0, 0, img.width, img.height);
          imageData = {
            width: imageDataObject.width,
            height: imageDataObject.height,
            data: Buffer.from(imageDataObject.data),
          };
        } catch (error) {
          strapi.log.error(`Failed to load non-WebP image: ${error.message}`);
          throw error;
        }
      }

      const canvas = createCanvas(imageData.width, imageData.height);
      const ctx = canvas.getContext('2d');
      const imageDataObject = ctx.createImageData(imageData.width, imageData.height);
      imageDataObject.data.set(imageData.data);
      ctx.putImageData(imageDataObject, 0, 0);

      const blurhash = encode(imageData.data, imageData.width, imageData.height, 4, 4);

      return blurhash;

    } catch (error) {
      strapi.log.error(`Error generating blurhash: ${error.message}`);
      throw error;
    }
  }
});
