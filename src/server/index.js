// import dependencies
var express = require('express'),
	app = express(),
	port = process.env.PORT || 8080,
	http = require('http'), 
    path = require("path"),
    socketIo = require('socket.io'), 
    session = require("express-session")({secret:"shhhhh", resave:true, saveUninitialized:true}), 
    sharedSession = require('express-socket.io-session');

app.use(express.static(__dirname + '/public'));
app.use(session);

app.get('/admin',function (req,res){res.sendFile(path.join(__dirname+'/public/admin/admin.html'));});
app.get('/user',function (req,res){res.sendFile(path.join(__dirname+'/public/user/user.html'));});
app.get('/user/room',function (req,res){res.sendFile(path.join(__dirname+'/public/user/room/index.html'));});
app.get('/user/room/quizz',function (req,res){res.sendFile(path.join(__dirname+'/public/user/room/quizz/index.html'));});
app.get('/session-index', function (req, res, next) {
  req.session.index = (req.session.index || 0) + 1;
  res.write("Index : " + req.session.index + " : " + req.sessionID);
  res.end();
});

// start webserver on port 8080
var server =  http.createServer(app);
server.listen(port);
console.log("Server running on 127.0.0.1:"+port);

var io = require("socket.io")(server);
io.use(sharedSession(session));

// server behaviour


var sessions = {};
var adminSocket, adminSession;

	//TODO : handle disconnecting
	//TODO : handle refreshing
	//TODO : handle return to last page

function admin(socket){
	console.log("ADMIN CONNECTS");
	adminSocket = socket;
	adminSession = socket.handshake.sessionID;
	socket.on("submitPoll", function (data){
		for(sessionID in sessions){
			sessions[sessionID].socket.on("readyToReceiveQuestion", function(){
				console.log("Ready from " + sessions[sessionID].pseudo);
			});
			sessions[sessionID].socket.emit("startPoll");
		}
		console.log("RECEIVED POLL : " + data);


	});
}

io.on("connection", function(socket){
	socket.emit("who are you ?");
	socket.on("admin", function(){admin(socket);});
	socket.on("user", function(){user(socket);});
});




function user (socket){
//  SESSION HANDLING

	var sessionID = socket.handshake.sessionID;
	if(sessionID in sessions){
		sessions[sessionID].socket = socket;
	} else {
		sessions[sessionID] = {socket:socket, pseudo:"Nick"};
	}

	socket.emit("confirmConnection");
	
	console.log("Connected : " + sessionID + " via socket " + socket.id);

	//  LOGIN


	socket.on("loginRequest", function(data){
		console.log("suscribing session for " + data +" ...");
		for(var sessionID in sessions){
			var userSession = sessions[sessionID];
			if(userSession.socket.id == socket.id){
				userSession.pseudo = data;
				socket.emit("loginValid");
			} else {
				userSession.socket.emit("userName", data);
				console.log("Sending " + data + " to " + userSession.pseudo);
			}
		}
	});

	//  SENDING USERS

	socket.on("readyToReceiveUsers", function(){
		console.log("Receive ready from : " + socket.id);
		for(var sessionID in sessions){
			var userSession = sessions[sessionID];
			socket.emit("userName", userSession.pseudo);
			console.log("Sending " + userSession.pseudo + " to " + socket.id);
		}
	});
}


	