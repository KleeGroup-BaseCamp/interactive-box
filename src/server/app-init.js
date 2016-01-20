var http = require("http");
var webpack = require("webpack");
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackConfig = require('../../webpack.config');
var app = require("./app-gets.js").app;

// SESSIONS

var Session = require('express-session');
var session = Session({
  secret: 'some secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    'name': 'test',
    httpOnly: false,
    secure: false,
    maxAge: ((60 * 1000) * 60)
  }
});

// MIDDLEWARES

app.use(session);
app.use(webpackDevMiddleware(webpack(webpackConfig)));

// IO & Session

var server =  http.createServer(app);
var io = require("socket.io")(server);
var nspUsers = io.of('/user');
var nspAdmin = io.of('/admin');
var nspShowRoom = io.of('/showRoom');
var sessionFunc = function(socket, next) {
    session(socket.handshake, {}, next);  
};

io.use(sessionFunc);
nspUsers.use(sessionFunc);
nspAdmin.use(sessionFunc);
nspShowRoom.use(sessionFunc);

exports.nspAdmin = nspAdmin;
exports.nspShowRoom = nspShowRoom;
exports.nspUsers = nspUsers;
exports.io = io;

// LANCEMENT DU SERVEUR

var port = process.env.PORT || 8080;
server.listen(port);
console.log("Server running on 127.0.0.1:"+port);