import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import { fileURLToPath } from 'url';

// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
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
        'robots.txt',
        'sitemap.xml',
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
