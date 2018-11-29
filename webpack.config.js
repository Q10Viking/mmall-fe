/*
* @Author: Viking
* @Date:   2018-11-28 15:35:17
* @Last Modified by:   Viking
* @Last Modified time: 2018-11-29 15:57:58
* 有不会的地方记得看文档
*/
var path = require('path');
var webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

//获取html-webpack-plugin参数的方法
var getHtmlConfig = function(name){
    return {
        template: './src/view/'+name+'.html',
        filename: 'view/'+name+'.html',
        inject: true,
        hash: true,
        chunks: ['common',name]
    }
}

//webpack config
var config = {
  mode: 'development',
  entry: {
    'common': './src/page/common/index.js',
    'index': './src/page/index/index.js',
    'login': './src/page/login/index.js'
    },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist',
    filename: 'js/[name].js'
  },
  plugins: [
    //css独立成单独文件
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "css/[name].css",
      chunkFilename: "[id].css"
    }),
    //html模板处理https://github.com/jantimon/html-webpack-plugin#options
    new HtmlWebpackPlugin(getHtmlConfig('index')),
    new HtmlWebpackPlugin(getHtmlConfig('login'))
  ],
  module: {
    rules: [   //处理css样式
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              publicPath: '../'
            }
          },
          "css-loader"
        ]
      },
      {
        test: /\.(gif|png|jpg|woff|svg|eot|ttf)\??.*$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,   // if less than 8192 b, add base64 encoded image to css
              name: "resource/[name].[ext]" // if more than 8192 kb move to this folder in build using file-loader
            }
          }
        ]
      }
    ]
  },

  externals:{   //引入jQuery，记得大写
    'jquery': 'window.jQuery'
  },
  optimization: {    //提取公共模板
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'common',  //现在common指定是entry中的common
          minSize: 100,   //超过这个100bytes才生成公共模板
          filename: 'js/base.js',  //指定位置，没有的话会以common.js取代
          chunks: 'initial',
          minChunks: 2
        }
      }
    }
  }
};

module.exports = config;
