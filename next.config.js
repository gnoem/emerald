module.exports = {
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `ws` module
    if (!isServer) {
      config.node = {
        ws: 'empty'
      }
    }

    return config;
  }
}