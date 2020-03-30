module.exports = {
    apps : [
        {
          name: "corona-service",
          script: "dist/index.js",
          env: {
            "NODE_ENV": "development",
            "PRODUCTION_HOST": "localhost",
          }
        }
    ]
}