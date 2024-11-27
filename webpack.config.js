const webpack = require('webpack');

module.exports = function override(config, env) {
  config.resolve.fallback = {
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    assert: require.resolve('assert'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify/browser'),
    url: require.resolve('url'),
    buffer: require.resolve('buffer'),
    process: require.resolve('process/browser'),  // Make sure process/browser is correctly resolved
    vm: require.resolve('vm-browserify')  // Fix for missing 'vm' module
  };

  config.module.rules.push({
    enforce: 'pre',
    test: /\.js$/,
    loader: 'source-map-loader',
    exclude: /node_modules\/plotly\.js/,  // Exclude plotly.js from source map loader
  });
  

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',  // Provide process to the browser environment
    }),
  ]);

  config.resolve.extensions = ['.mjs', '.js', '.json'];

  return config;
};
