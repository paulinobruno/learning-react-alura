const path = require('path');
const webpack = require('webpack');
const BabiliPlugin = require('babili-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const plugins = [
  new HtmlWebpackPlugin({
    hash: true,
    minify: {
      html5: true,
      collapseWhitespace: true,
      removeComments: true,
    },
    filename: 'index.html',
    template: __dirname + '/main.html'
  }),
  new ExtractTextPlugin('styles.css'),
  new webpack.ProvidePlugin({
    '$': 'jquery/dist/jquery',
    'jQuery': 'jquery/dist/jquery',
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: 'vendor.bundle.js',
  }),
];

let SERVICE_URL = JSON.stringify('http://localhost:3000');
if (process.env.NODE_ENV === 'production') {
  SERVICE_URL = JSON.stringify('http://api.paulinobruno.com');

  plugins.push(new webpack.optimize.ModuleConcatenationPlugin());
  plugins.push(new BabiliPlugin());
  plugins.push(new OptimizeCssAssetPlugin({
    cssProcessor: require('cssnano'),
    cssProcessorOptions: {
      discardComments: { removeAll: true }
    },
    canPrint: true
  }));
}

plugins.push(new webpack.DefinePlugin({ SERVICE_URL }));

module.exports = {
  entry: {
    app: './app-src/app.js',
    vendor: ['jquery', 'bootstrap', 'reflect-metadata'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        }),
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
      },
    ],
  },
  plugins,
};
