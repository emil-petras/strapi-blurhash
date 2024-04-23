const { createCanvas, Image } = require('canvas');
const { encode } = require('blurhash');

module.exports = ({ strapi }) => ({
  async generateBlurhash(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const image = new Image();
      image.src = buffer;

      // Set dimensions for the thumbnail used to generate the blurhash
      const newWidth = 32;
      const newHeight = 32;

      // Create a canvas and draw the image in the thumbnail size
      const canvas = createCanvas(newWidth, newHeight);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, newWidth, newHeight);

      // Get image data from canvas and encode it to a blurhash
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const blurhash = encode(imageData.data, canvas.width, canvas.height, 4, 4);

      return blurhash;
    } catch (error) {
      console.error(`Error generating blurhash: ${error.message}`);
      throw error;
    }
  }
 });