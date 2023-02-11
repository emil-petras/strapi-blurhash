"use strict";

module.exports = ({ strapi }) => {
	const generateBlurHash = async (event) => {
		const { data } = event.params;
		if (data.mime && data.mime.startsWith("image/")) {
			data.blurHash = await strapi
				.plugin("strapi-blurHash")
				.service("blurHash")
				.generateBlurHash(data.url);
		}
	};

	strapi.db.lifecycles.subscribe({
		models: ["plugin::upload.file"],
		beforeCreate: generateBlurHash,
		beforeUpdate: generateBlurHash,
	});
};
