const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'child-fre.js',
    library: 'child-fre',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    publicPath:
      process.env.NODE_ENV === 'production'
        ? 'https://s-sh-16-clicli.oss.dogecdn.com/'
        : 'http://localhost:3001'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              [
                '@babel/plugin-transform-react-jsx',
                {
                  pragma: 'h'
                }
              ]
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  optimization: {
    splitChunks: false,
    minimize: false
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),

    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ],
  devServer: {
    headers: { 'Access-Control-Allow-Origin': '*' },
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 3001,
    historyApiFallback: true,
    hot: true,
    inline: false,
    // lazy: true,
  }
}
