module.exports = {
    apps : [{
      name: "corona-service",
      script: "./dist/index.js",
      autorestart: false,
      watch: false,
      node_args: "--experimental-modules --es-module-specifier-resolution=node",
      env_production: {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        PRODUCTION_HOST: JSON.stringify(process.env.PRODUCTION_HOST)
      }
    }],
};
