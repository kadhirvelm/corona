module.exports = {
    apps : [{
      name: "corona-service",
      script: "dist/index.js",
      env: {
        NODE_ENV: process.env.NODE_ENV,
        PRODUCTION_HOST: process.env.PRODUCTION_HOST,
      },
    }]
  }