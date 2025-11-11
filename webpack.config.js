const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src/index.tsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '~': path.resolve('./src'),
    },
  },
  devtool: process.env.NODE_ENV === 'production' ? false : 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.LOCAL_ENV': JSON.stringify(process.env.LOCAL_ENV),
      'process.env.NETLIFY_SERVER': JSON.stringify(process.env.NETLIFY_SERVER),
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.ejs',
      templateParameters: {
        LOCAL_ENV: process.env.LOCAL_ENV || false,
      },
    }),
    new CopyPlugin({
      patterns: [
        'CNAME',
        'favicon.png',
        {
          from: 'src/assets',
          to: 'assets',
        },
      ],
    }),
  ],
  devServer: {
    hot: true,
    port: 8097,
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, 'dist'),
    },
  },
};
