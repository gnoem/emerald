module.exports = {
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `ws` module
    if (!isServer) {
      config.node = {
        bufferutil: "bufferutil",
        "utf-8-validate": "utf-8-validate",
      }
    }

    return config;
  },
  target: 'serverless'
}