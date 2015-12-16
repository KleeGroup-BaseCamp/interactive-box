var appInit =  require('./app-init.js');
var io = appInit.io;
var fs = require('fs');
var path = require("path");
var QUESTIONNARIES_FILE = path.join(__dirname, '/questionnaries.json');
var questionnary;
var maxCount = 0;

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
	adminSession = socket.handshake.sessionID;
	var questionCount = 0;

	socket.on("launchPoll", function (pollId){
		console.log("Launching poll n°" + pollId);
		fs.readFile(QUESTIONNARIES_FILE, function(err, data) {
		    if (err) {
		      console.error(err);
		      process.exit(1);
		    }
		var questionnaries = JSON.parse(data);
		var length = questionnaries.length;
        for(var i=0;i<length;i++){
        	if(!questionnary){
	        	if(questionnaries[i].id == pollId){
	        		questionnary = questionnaries[i];
	        		maxCount = questionnary.questions.length;
	        	}
        	}
        }
        console.log("FOUND " + questionnary.title);
		socket.emit("goToPollPage");
		});
	});

	socket.on("readyToReceiveQuestion", function(){
		if(questionCount<maxCount){
			socket.emit("question", questionnary.questions[questionCount]);
			questionCount++;
		} else {
			socket.emit("no-more-questions");
		}
	});

	socket.emit("registered");
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
