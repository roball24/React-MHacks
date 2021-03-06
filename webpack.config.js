var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');

var cssExtractor = new ExtractTextWebpackPlugin('./[name].css');
var lifecycleEvent = process.env.npm_lifecycle_event;

var devConfig = {
    entry: './src/app.jsx',
    output: {
        publicPath: '/',
        path: __dirname + '/public',
        filename: 'js/app.js'
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                enforce: 'pre',
                use: ['eslint-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader',
                    'postcss-loader?' + JSON.stringify(
                    [ autoprefixer({ browsers: ['last 3 versions'] }) ]
                )]
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: ['babel-loader']
            },
            {
                test: /\.(eot|ttf|woff|woff2|otf)$/,
                use: 'url-loader'
            },
            { 
                test: /\.(png|jpg|jpeg|gif|woff|svg)$/,
                exclude: /favicon/,
                use: 'file-loader'
            }
        ]
    },
    plugins: [
        // inject styles and javascript into index.html
        new HtmlWebpackPlugin({
            title: 'Webpack Build',
            template: './src/index.html'
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"development"'
        })
    ],
    devServer: {
        historyApiFallback: true,
        contentBase: './public',
        proxy: {
            '/api': {
                target: 'http://localhost:9090',
                xfwd: true,
                changeOrigin: true
            }
        }
    }
}

var buildConfig = {
    entry: './src/app.jsx',
    output: {
        publicPath: '/',
        path: __dirname + '/public',
        filename: 'js/app.js'
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                enforce: 'pre',
                use: ['eslint-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: cssExtractor.extract({
                    fallbackLoader: 'style-loader',
                    loader: 'css-loader',
                    allChunks: true
                })
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: ['babel-loader']
            },
            // {
            //     test: /\.(eot|ttf|woff|woff2|otf)(\?\S*)?$/,
            //     use: ['file-loader?name=fonts/[name].[ext]']
            // },
            { test: /\.(png|jpg|jpeg|gif|woff|svg|otf)$/, use: 'file-loader' }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Webpack Build',
            template: './src/index.html'
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new CleanWebpackPlugin(['public/fonts', 'public/js', 'public/styles', 'public/index.html']),
        cssExtractor,
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            minimize: true
        }),
        new CopyWebpackPlugin([
            {context: "./src/favicon/", from: '**/*', to: './favicon/'},
            {context: "./src/fonts/", from: '**/*', to: './fonts/'}
        ])
    ],
    devServer: {
        historyApiFallback: true,
        contentBase: './public',
        proxy: {
            '/api': {
                target: 'http://localhost:9090',
                xfwd: true,
                changeOrigin: true
            }
        }
    }
}

switch (lifecycleEvent) {
    case 'build':
    module.exports = buildConfig;
    break;
    default:
    module.exports = devConfig;
    break;
}