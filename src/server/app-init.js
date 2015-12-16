var express = require('express'),
	app = express(),
  	path = require("path"),
  	session = require("express-session")({secret:"shhhhh", resave:true, saveUninitialized:true}),
 	sharedSession = require('express-socket.io-session'),
	webpackDevMiddleware = require('webpack-dev-middleware'),
	webpack = require('webpack');

var port = process.env.PORT || 8080,
	http = require('http'),
    socketIo = require('socket.io');

var webpackConfig = require('../../webpack.config');

app.use(session);
app.use(webpackDevMiddleware(webpack(webpackConfig)));

app.get('/admin',function (req,res){res.sendFile(path.join(__dirname, "../client/admin/admin.html"));});

app.get('/user',function (req,res){res.sendFile(path.join(__dirname,'../newClient/user/login.html'));});
app.get('/loginJS',function (req,res){res.sendFile(path.join(__dirname,'../newClient/user/login.js'));});

app.get('/user/room',function (req,res){res.sendFile(path.join(__dirname+'../client/user/room/index.html'));});
app.get('/user/room/quizz',function (req,res){res.sendFile(path.join(__dirname+'../client/user/room/quizz/index.html'));});
app.get('/session-index', function (req, res, next) {
  req.session.index = (req.session.index || 0) + 1;
  res.write("Index : " + req.session.index + " : " + req.sessionID);
  res.end();
});

// start webserver on port 8080
var server =  http.createServer(app);
server.listen(port);
console.log("Server running on 127.0.0.1:"+port);

exports.io = require("socket.io")(server);
exports.io.use(sharedSession(session));