var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var config = {
    entry: './src/client/index.js',
    output: {
        path: __dirname + '/dist',
        filename: 'client.js',
        publicPath: '/'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Interactive Box Client',
            inject: 'body',
            templateContent: '<body><div id="interactive-box"/></body>'
        })
    ],
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loaders: ['babel'],
                include: [
                    path.resolve(__dirname, './src/client')
                ]
            }
        ]
    }
};

module.exports = config;
