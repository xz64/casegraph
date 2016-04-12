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
  entry: path.join(__dirname, srcDir, 'app.js'),
  output: {
    path: buildDir,
    filename: 'app.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Case Graph',
      minify: htmlMinificationConfig
    }),
    new CleanWebpackPlugin([buildDir]),
    minifyJSPlugin,
    new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/])
  ],
  module: {
    loaders: [
      {test: /\.jade$/, loader: 'jade', exclude: /node_modules/},
      {test: /\.css/, loaders: ['style', 'css'],
        exclude: /node_modules\/(?!qtip2)/}
    ]
  },
  devtool: devtools
};

module.exports = config;
