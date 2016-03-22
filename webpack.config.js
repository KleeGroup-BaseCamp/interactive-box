var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var config = {
    entry: './src/client/index2.js',
    output: {
        path: __dirname + '/dist',
        filename: 'client.js',
        publicPath: '/'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Interactive Box Client',
            inject: 'body',
            templateContent: '<html> <head> <meta charset="utf-8" /> <body><div id="interactive-box"/></body> </head> </html>'
        })
    ],
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loaders: ['babel'],
                include: [
                    path.resolve(__dirname, './src')
                ]
            },
            {
              test: /\.css$/, // Only .css files
              loader: 'style!css' // Run both loaders
            }
        ]
    },
    resolve: {
        alias: {
            "react": __dirname + '/node_modules/react',
            "react/addons": __dirname + '/node_modules/react/addons',
        }
    }
};

module.exports = config;
