module.exports = {
    apps : [{
      name: "corona-service",
      script: "./dist/index.js",
      autorestart: false,
      watch: false,
      node_args: "--experimental-modules --es-module-specifier-resolution=node",
      env_production: {
        NODE_ENV: process.env.NODE_ENV,
        PRODUCTION_HOST: process.env.PRODUCTION_HOST
      }
    },
    {
      name: "frontend",
      script: "serve",
      env_production: {
        PM2_SERVE_PATH: "packages/frontend/dist",
        PM2_SERVE_PORT: 81,
      }
    }],
};
