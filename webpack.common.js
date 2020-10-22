const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: {
    index: './src/index.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        include: [path.resolve('src')],
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/i,
        use: [
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
          },
          'sass-loader',
          {
            loader: 'sass-resources-loader',
            options: {
              resources: 'them.scss',
            },
          },
        ],
      },
    ],
  },
  devtool: 'source-map',
  plugins: [
    new Dotenv(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public/',
          to: path.resolve(__dirname, 'dist'),
        },
      ],
    }),

    new webpack.ProvidePlugin({
      React: 'react',
    }),

    new CleanWebpackPlugin(),
  ],
  resolve: {
    extensions: ['.js', '.scss'],
    alias: { '@': path.resolve(__dirname, 'src') },
  },
};
