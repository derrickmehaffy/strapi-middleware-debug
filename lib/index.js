module.exports = (strapi) => {
	return {
		beforeInitialize() {
			strapi.config.middleware.load.after.unshift('debug');
		},
		initialize() {
			strapi.app.use(async (ctx, next) => {
				const settings = strapi.config.middleware.settings.debug.logging;

				// Setup Global logging
				const globalKeys = Object.keys(settings.global);
				console.log(globalKeys);

				// Setup Request logging
				const requestKeys = Object.keys(settings.request);
				console.log(requestKeys);

				await next();

				// Setup Response logging
				const responseKeys = Object.keys(settings.response);
				console.log(responseKeys);
			});
		},
	};
};
