const { sanitizeEntity } = require("strapi-utils");

module.exports = (strapi) => {
  return {
    beforeInitialize() {
      // TODO: How do we load this middleware after U&P
      strapi.config.middleware.load.after.unshift("debug");
    },
    initialize() {
      strapi.app.use(async (ctx, next) => {
        const settings = strapi.config.middleware.settings.debug.logging;

        // TODO: Add option for excluding Admin requests => settings.adminRequests
        // TODO: Add option for excluding User requests => settings.userRequests

        // Setup Global logging
        const globalKeys = Object.keys(settings.global);

        globalKeys.forEach(async (key) => {
          if (settings.global[key] === true) {
            if (key === "userState") {
              let user = sanitizeEntity(ctx.state.user, {
                model: strapi.query("user", "users-permissions").model,
              });
              console.log(`${key}:`, user);
            } else if (key === "fullState") {
              console.log(`${key}:`, ctx.state);
            } else {
              console.log(`${key}:`, ctx[key]);
            }
          }
        });

        await next();

        // Setup Request logging
        const requestKeys = Object.keys(settings.request);

        requestKeys.forEach(async (key) => {
          if (settings.request[key] === true) {
            if (key === "global") {
              console.log(`${key}:`, ctx.request);
            } else {
              console.log(`${key}:`, ctx.request[key]);
            }
          }
        });

        // Setup Response logging
        const responseKeys = Object.keys(settings.response);

        responseKeys.forEach(async (key) => {
          if (settings.response[key] === true) {
            if (key === "global") {
              console.log(`${key}:`, ctx.response);
            } else {
              console.log(`${key}:`, ctx.response[key]);
            }
          }
        });
      });
    },
  };
};
