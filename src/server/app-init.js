var session = require("express-session")({secret:"shhhhh", resave:true, saveUninitialized:true}),
 	sharedSession = require('express-socket.io-session'),
	webpackDevMiddleware = require('webpack-dev-middleware'),
	webpack = require('webpack'), 
	port = process.env.PORT || 8080,
	http = require('http'),
    socketIo = require('socket.io');

var app = require("./app-gets.js").app;
var webpackConfig = require('../../webpack.config');

app.use(session);
app.use(webpackDevMiddleware(webpack(webpackConfig)));

var server =  http.createServer(app);
server.listen(port);
console.log("Server running on 127.0.0.1:"+port);

exports.io = require("socket.io")(server);
exports.io.use(sharedSession(session));