const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: path.resolve('src/index.js'),
  },
  output: {
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('src/pages/index.pug'),
      filename: "../index.html"
    })
  ],
  watch: true,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/env"],
          plugins: [
            ["@babel/plugin-proposal-class-properties", {"loose": true}],
            ["@babel/plugin-transform-object-assign"]
          ]
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          pretty: true
        }
      }
    ]
  }
};