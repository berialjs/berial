const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: "./src/index",
  mode: "production",
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    port: 3001,
    headers: {'Access-Control-Allow-Origin': '*'},
    historyApiFallback: true,
  },
  output: {
    publicPath: "http://localhost:3001/",
    library: 'one-app',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-react"],
        },
      },
    ],
  },
  //http://localhost:3002/remoteEntry.js
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
  ],
};
