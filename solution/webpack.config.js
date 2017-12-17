const path = require('path');

module.exports = {
  entry: {
    'client/static/base': './ts_code/client/src/index.ts',
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts' ],
    alias: {
        'vue': 'vue/dist/vue.esm.browser.js'
    }
  },
  externals: {

  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
