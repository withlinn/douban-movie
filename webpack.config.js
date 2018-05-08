const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  entry:{
    index: './src/js/index.js',
    detail: './src/js/detail.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name]-[chunkhash].js'
  },
  // 本地服务器
  devServer:{
    contentBase: './src', // 本地服务器所加载的页面目录
    historyApiFallback: true,//不跳转
    inline: true,//实时刷新
    port: 9090
  },
  module:{
    rules:[
      {
        test: /\.css/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.js/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins:[
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      favicon: './src/favicon.ico',
      minify:{
        removeComments: true,
        minifyCSS: true,
      },
      chunks:['index']
    }),
    new HtmlWebpackPlugin({
      filename: 'detail.html',
      template: './src/detail.html',
      favicon: './src/favicon.ico',
      minify:{
        removeComments: true,
        minifyCSS: true
      },
      chunks:['detail']
    }),
    new ExtractTextPlugin("css/[name].css")
  ]
}