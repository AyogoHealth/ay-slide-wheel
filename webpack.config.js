/*! Copyright 2021 Ayogo Health Inc. */

const path = require('path');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const CSSGeorge = require('less-plugin-css-george');

const baseconfig = {
  resolve: {
    extensions: ['.ts', '.mjs', '.js', '.json']
  },
  output: {
    path: __dirname + '/demo/generated',
    devtoolModuleFilenameTemplate: "[absolute-resource-path]"
  },
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      { test: /\.mjs$/, include: /node_modules/, type: 'javascript/auto' },
      { test: /\.ts$/, loader: 'ts-loader', options: { experimentalWatchApi: true, compilerOptions: { declaration: false }}, include: [/src/, /demo/] },
      { test: /\.m?js?$/, loader: 'source-map-loader', include: /node_modules/ },
      { test: /\.less$/, use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
          loader: 'less-loader',
          options: {
            lessOptions: {
              sourceMap: {
                sourceMapRootpath: path.resolve(__dirname, 'demo')
              },
              plugins: [
                new CSSGeorge({fallback: true})
              ]
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
    target: 'web'
  }, baseconfig)
];

