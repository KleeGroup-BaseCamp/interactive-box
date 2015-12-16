var appInit =  require('./app-init.js');
var io = appInit.io;


var sessions = {};

var adminSocket, adminSession;

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

	//  REGISTRATION CONFIRMATION

	socket.emit("registered");
}



function admin (socket){

	console.log("ADMIN connects : " + socket.handshake.sessionID + " via socket " + socket.id);

	adminSocket = socket;

	if(!adminSession){

		adminSession = socket.handshake.sessionID;

		socket.on("launchPoll", function (data){
			for(sessionID in sessions){
				sessions[sessionID].socket.on("readyToReceiveQuestion", function(){
					console.log("Ready from " + sessions[sessionID].pseudo);
				});
				sessions[sessionID].socket.emit("startPoll");
			}
			console.log("RECEIVED POLL : " + data);
		});

		socket.emit("registered");
	} 
}



io.on("connection", function(socket){
	socket.emit("who are you ?");
	console.log("Connection of socket " + socket.id);
	socket.on("admin", function(){admin(socket);});
	socket.on("user", function(){user(socket);});


    // Barchart Answers Handling
    socket.on("answered3", function() {
    socket.broadcast.emit("Answer3");
    socket.emit("Answer3");

    });
    socket.on("answered2", function() {
    socket.emit("Answer2");
    socket.broadcast.emit("Answer2");
    });
    
    socket.on("answered1", function(){
    socket.emit("Answer1");
    socket.broadcast.emit("Answer1");
    });
});
