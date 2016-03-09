var appInit =  require('./app-init.js');
var io = appInit.io;
var fs = require('fs');
var path = require("path");
var QUESTIONNARIES_FILE = path.join(__dirname, '/questionnaries.json');
var questionnary;
var maxCount = 0;
var questionCount = 0;
var answerCount = 0;

var pollAdmin = require("./poll-admin.js");
var pollUser = require("./poll-user.js");

var adminSocket, adminSession, showSocket;
var sessions = {};

io.on("connection", function(socket){
    console.log("Connexion du socket " + socket.handshake.sessionID);
});

var nspAdmin = appInit.nspAdmin;
nspAdmin.on('connection', function(socket){
	console.log("Admin session " + socket.handshake.sessionID + "via socket " + socket.id);
	admin(socket);
});

var nspUsers = appInit.nspUsers;
nspUsers.on('connection', function(socket){
	console.log("User session " + socket.handshake.sessionID + "via socket " + socket.id);
	user(socket);
});


var nspShowRoom = appInit.nspShowRoom;
nspShowRoom.on('connection', function(socket){
	console.log("Showman session " + socket.handshake.sessionID + "via socket " + socket.id);
	show(socket);
});


function findSession(socket){
	var sessionID = socket.handshake.session.id;
    var alreadyThere = false;
	if(sessionID in sessions){
		var oldSocket = sessions[sessionID].socket;
		alreadyThere = socket.id == oldSocket.id;
		sessions[sessionID].socket = socket;
	} else {
		sessions[sessionID] = {socket:socket, pseudo:"Nick"};
	}
	return alreadyThere;
}

function disconnect(socket){
    console.log("Déconnexion du socket " + socket.id);
    var sessionID = socket.handshake.session.id;
    io.of("/user").emit("removeUserName", sessions[sessionID].pseudo);
    if(sessionID in sessions){
        delete sessions[sessionID];
    }
};

function user (socket){
    var already = findSession(socket);
	socket.emit("confirmConnection");
	pollUser.manageUserPoll(socket, io);
    socket.on("disconnect", function(){
        disconnect(socket);
    });
	if(!already){


		//  LOGIN
		socket.on("loginRequest", function(pseudoRequested){
            console.log("Login request " + pseudoRequested +" ...");
            var dejaUtilise = false;
            for (var sessionID in sessions){
                if (pseudoRequested == sessions[sessionID].pseudo){
                    dejaUtilise = true;
                }
            }
            if (dejaUtilise == false){
                for(var sessionID in sessions){
                    var userSession = sessions[sessionID];
                    if(userSession.socket.id == socket.id){
                        userSession.pseudo = pseudoRequested;
                        socket.emit("loginValid");
                        socket.emit("registered");
                        console.log("sent registered");
                    } else {
                        userSession.socket.emit("userName", pseudoRequested);
                        console.log("Sending " + pseudoRequested + " to " + userSession.pseudo);
                    }
                }
            }
            else {
                console.log("Pseudo déjà utilisé");
                socket.emit("PseudoDejaUtilise");
            }
            if(showSocket){
                showSocket.emit("userName", pseudoRequested);
            }
		});

		//  SENDING USERS

		  socket.on("readyToReceiveUsers", function(){
			for(var sessionID in sessions){
				var userSession = sessions[sessionID];
				socket.emit("userName", userSession.pseudo);
			}
		});
	}
}

function admin (socket){
	adminSocket = socket;
	adminSession = socket.handshake.sessionID;
    pollAdmin.manageAdminPoll(socket, io);
	socket.emit("registered");
    socket.emit("nombre de personnes", 34);
}

function show (socket){
    showSocket = socket;
    socket.emit("confirmConnection");
    socket.on("readyToReceiveUsers", function(){
        for(var sessionID in sessions){
            var userSession = sessions[sessionID];
            socket.emit("userName", userSession.pseudo);
        }
    });
}