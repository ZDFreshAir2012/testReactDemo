var pkg = require('./package.json')
var path = require('path')
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        app: path.resolve(__dirname, 'app/index.jsx'),
        // 将 第三方依赖 单独打包
        vendor: Object.keys(pkg.dependencies)

        // vendor: [
        //   'react',
        //   'react-dom',
        //   'react-redux',
        //   'react-router',
        //   'redux',
        //   'es6-promise',
        //   'whatwg-fetch',
        //   'immutable'
        // ]
    },


    output: {
        path: __dirname + "/build",

        // // 使用这个, 所以内容在一个文件夹
        // filename: "[name].[chunkhash:8].js",
        // publicPath: '/'

        // // 使用这个， 可以帮忙创建css 和 js 文件夹  /js/   /css/
        filename: "/js/[name].[chunkhash:8].js"
    },

    resolve:{
        extensions:['', '.js','.jsx']
    },

    module: {
        loaders: [
            { test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel' },
            { test: /\.less$/, exclude: /node_modules/, loader: ExtractTextPlugin.extract('style', 'css!postcss!less') },
            { test: /\.css$/, exclude: /node_modules/, loader: ExtractTextPlugin.extract('style', 'css!postcss') },

            // 这里的命名可能有问题   &name之后
            { test:/\.(png|gif|jpg|jpeg|bmp)$/i, loader:'url-loader?limit=5000&name=/img/[name].[chunkhash:8].[ext]' },

            // 这里的命名可能有问题   &filename之后
            { test:/\.(png|woff|woff2|svg|ttf|eot)($|\?)/i, loader:'url-loader?limit=5000&filename=/fonts/[name].[chunkhash:8].[ext]'}
            // { test:/\.(png|woff|woff2|svg|ttf|eot)($|\?)/i, loader:'url-loader?limit=5000'}
        ]
    },
    postcss: [
        require('autoprefixer')
    ],

    plugins: [
        // webpack 内置的 banner-plugin
        new webpack.BannerPlugin("Copyright by 自己备注"),

        // html 模板插件
        new HtmlWebpackPlugin({
            template: __dirname + '/app/index.tmpl.html'
        }),

        // 定义为生产环境，编译 React 时压缩到最小
        new webpack.DefinePlugin({
            'process.env':{
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }
        }),

        // 为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
        new webpack.optimize.OccurenceOrderPlugin(),

        new webpack.optimize.UglifyJsPlugin({
            compress: {
                //supresses warnings, usually from module minification
                warnings: false
            }
        }),

        // 分离CSS和JS文件  看是否要创建文件夹 /css/
        new ExtractTextPlugin('/css/[name].[chunkhash:8].css'),

        // 提供公共代码
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            // 看是否要创建文件夹 /js/
            filename: '/js/[name].[chunkhash:8].js'
        }),

        // 可在业务 js 代码中使用 __DEV__ 判断是否是dev模式（dev模式下可以提示错误、测试报告等, production模式不提示）
        new webpack.DefinePlugin({
            __DEV__: JSON.stringify(JSON.parse((process.env.NODE_ENV == 'dev') || 'false'))
        })
    ]
}