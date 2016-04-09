var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var path = require('path');

var srcDir = 'src';
var buildDir = 'dist';
var isProduction = process.env.NODE_ENV === 'production';

var htmlMinificationConfig = isProduction ?
  {
    collapseWhitespace: true
  } :
  {};

var devtools = isProduction ? '' : 'source-map';

var minifyJSPlugin = isProduction ? new webpack.optimize.UglifyJsPlugin({}) :
  Function.prototype;

var config = {
  entry: path.join(__dirname, srcDir, 'index.js'),
  output: {
    path: buildDir,
    filename: 'app.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Voting App',
      minify: htmlMinificationConfig
    }),
    new CleanWebpackPlugin([buildDir]),
    minifyJSPlugin
  ],
  module: {
    loaders: [
      {test: /\.jade$/, loader: 'jade', exclude: /node_modules/}
    ]
  },
  devtool: devtools
};

module.exports = config;
