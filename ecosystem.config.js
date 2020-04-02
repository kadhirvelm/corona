module.exports = {
    apps : [{
      name: "corona-service",
      script: "./dist/index.js",
      instances: "max",
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      node_args: "--experimental-modules --es-module-specifier-resolution=node",
      env_production: {
        NODE_ENV: process.env.NODE_ENV,
        PRODUCTION_HOST: process.env.PRODUCTION_HOST
      }
    }],
};
