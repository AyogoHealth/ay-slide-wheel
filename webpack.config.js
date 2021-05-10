/*! Copyright 2021 Ayogo Health Inc. */

const path = require('path');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin');

const baseconfig = {
  resolve: {
    extensions: ['.ts', '.mjs', '.js', '.json', 'html']
  },
  output: {
    path: __dirname + '/demo/generated',
    publicPath: 'generated/',
    chunkFilename: '[name].bundle.js',
    devtoolModuleFilenameTemplate: "[absolute-resource-path]"
  },
  devtool: 'source-map',
  mode: 'development',
  module: {
    rules: [
      { test: /\.mjs$/, include: /node_modules/, type: 'javascript/auto' },
      { test: /\.ts$/, loader: 'ts-loader', options: { experimentalWatchApi: true, compilerOptions: { declaration: false }}, include: [/src/, /demo/] },
      { test: /\.m?js?$/, loader: 'source-map-loader', include: /node_modules/ },
      { test: /\.less$/, use: [
        MiniCssExtractPlugin.loader,
        { loader: 'css-loader', options: { url: false } },
        {
          loader: 'less-loader',
          options: {
            lessOptions: {
              sourceMap: {
                sourceMapRootpath: path.resolve(__dirname, 'demo')
              }
            }
          }
        }
      ], include: [/node_modules/, /src/, /demo/] }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: '[name].css' }),
    new ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(en)$/),
    new ModuleConcatenationPlugin()
  ]
};

module.exports = [
  // Web Browser
  Object.assign({
    entry: {
      angular: './demo/app-angular.ts',
      web: './demo/app-web.ts',
      style: './demo/style.less'
    },
    devServer: {
      contentBase: path.resolve(__dirname, 'demo'),
      publicPath: '/generated/'
    },
    target: 'web'
  }, baseconfig)
];

