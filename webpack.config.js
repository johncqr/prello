var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: path.join(__dirname, "src"),
  devtool: debug ? "inline-sourcemap" : null,
  // entry: "./boardpage.js",
  entry: "./boards.js",
  // entry: "./login.js",
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015'],
        }
      },
    ]
  },
  output: {
    path: __dirname + "/public/javascripts",
    // filename: "boardpage.js",
    filename: "boards.js",
    // filename: "login.js",
  },
  plugins: debug ? [
  ] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],
};