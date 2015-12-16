// import dependencies


var appInit =  require('./app-init.js');
var io = appInit.io;

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
		console.log("RECEIVED POLLl : " + data);


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
