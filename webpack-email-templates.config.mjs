import path from 'path';
import fs from 'fs';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlInlineScriptPlugin from 'html-inline-script-webpack-plugin';
import HtmlInlineCSSWebpackPlugin from 'html-inline-css-webpack-plugin';
import { fileURLToPath } from 'url';

const HtmlInlineCSSPlugin = HtmlInlineCSSWebpackPlugin.default;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatesDir = path.resolve(__dirname, 'src/email-templates');

const templateFiles = fs.readdirSync(templatesDir).filter(file => file.endsWith('.tsx'));

const entries = Object.fromEntries(
  templateFiles.map(file => {
    const name = file.replace('.tsx', '');
    return [name, path.join(templatesDir, file)];
  }),
);

const htmlPlugins = templateFiles.map(file => {
  const name = file.replace('.tsx', '');

  return new HtmlWebpackPlugin({
    filename: `${name}/index.html`,
    template: path.join(templatesDir, 'index.ejs'),
    inject: 'body',
    templateParameters: {
      TEMPLATE_NAME: name,
      LOCAL_ENV: process.env.LOCAL_ENV || false,
    },
  });
});

export default {
  entry: entries,
  output: {
    path: path.resolve(__dirname, 'emails'),
    publicPath: '/',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '~': path.resolve('./src'),
    },
  },
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
    }),

    ...htmlPlugins,

    new HtmlInlineScriptPlugin(),
    new HtmlInlineCSSPlugin(),
  ],
};
