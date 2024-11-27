// config-overrides.js

const webpack = require('webpack');
const path = require('path');

module.exports = function override(config, env) {
  // 1. Resolve fallbacks for Node.js core modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    assert: require.resolve('assert'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify/browser'),
    url: require.resolve('url'),
    buffer: require.resolve('buffer'),
    process: require.resolve('process'),
    vm: require.resolve('vm-browserify'),
  };

  // 2. Add Source Map Loader for specific modules
  config.module.rules.push({
    enforce: 'pre',
    test: /\.js$/,
    loader: 'source-map-loader',
    exclude: /node_modules\/(plotly\.js|ace-builds)/,
  });

  // 3. Provide global variables
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process',
    }),
  ]);

  // 4. Add alias for process/browser to process
  config.resolve.alias = {
    ...config.resolve.alias,
    'process/browser': require.resolve('process'),
    mathjs: path.resolve(__dirname, 'node_modules/mathjs/lib/esm'),
  };

  // 5. Ensure file extensions are resolved correctly
  config.resolve.extensions = ['.mjs', '.js', '.json'];

  // 6. Set fullySpecified to false to handle ESM module resolution
  config.resolve.fullySpecified = false;

  return config;
};
