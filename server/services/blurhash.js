"use strict";

const { getPlaiceholder } = require("plaiceholder");

module.exports = ({ strapi }) => ({
	async generateBlurHash(url) {
		try {
			return (await getPlaiceholder(url)).blurHash.hash;
		} catch (e) {
			strapi.log.error(e);
			return null;
		}
	},
});
