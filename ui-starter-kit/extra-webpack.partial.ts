import * as webpack from 'webpack';
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true
          },
        },
      }),
    ],
  },
} as webpack.Configuration;
