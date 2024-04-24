const { encode } = require('blurhash');
const sharp = require('sharp');

module.exports = ({ strapi }) => ({
  async generateBlurhash(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Calculate the width and height of the resized image
      const width = 32;
      const height = 32;

      // Resize the image and get raw pixel data
      const resizedImage = await sharp(buffer)
        .resize(width, height)
        .ensureAlpha()
        .raw()
        .toBuffer();

      // Generate the blurhash using the raw pixel data
      const blurhash = encode(
        new Uint8ClampedArray(resizedImage), 
        width, 
        height, 
        4, 
        4
      );

      return blurhash;
    } catch (error) {
      strapi.log.error(`Error generating blurhash: ${error.message}`);
      throw error;
    }
  }
 });