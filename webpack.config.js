var path = require('path');

module.exports = {
    entry: "./main.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            {test: /.js$/,
              loader: 'babel',
              exclude: [
                  path.resolve(__dirname, './node_modules')
              ]}
        ]
    }
};