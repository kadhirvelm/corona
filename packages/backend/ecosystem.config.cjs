module.exports = {
    apps : [
        {
          name: "corona-service",
          script: "./dist/index.js",
          env: {
            "NODE_ENV": $NODE_ENV,
            "PRODUCTION_HOST": $PRODUCTION_HOST,
          }
        }
    ]
}