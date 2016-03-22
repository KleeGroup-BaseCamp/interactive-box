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

// Console log à la connexion d'un socket
io.on("connection", function(socket){
    console.log("Connexion du socket " + socket.handshake.sessionID);
});

// Traitement spécifique aux différents namespaces
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

// Regarde si un utilisateur existe déjà pour la session du socket passé en argument
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

// Déconnexion d'un socket d'utilisateur
function disconnect(socket){
    console.log("Déconnexion du socket " + socket.id);
    var sessionID = socket.handshake.session.id;
    var pseudo = sessions[sessionID].pseudo;
    io.of("/user").emit("remove-user-name", pseudo);
    io.of("/admin").emit("remove-user-name", pseudo);
    io.of("/showRoom").emit("remove-user-name", pseudo);
    if(sessionID in sessions){
        delete sessions[sessionID];
    }
};

function user (socket){
    var already = findSession(socket);
	socket.emit("confirm-connection");
	pollUser.manageUserPoll(socket, io);
    socket.on("disconnect", function(){ disconnect(socket); });
    
    // Si c'est la première fois que l'utilisateur se connecte
	if(!already){
        
		socket.on("login-request", function(pseudoRequested){
            console.log("Login request " + pseudoRequested +" ...");
            
            //Détection de pseudo déjà utilisé
            var dejaUtilise = false;
            for (var sessionID in sessions){
                if (pseudoRequested == sessions[sessionID].pseudo){
                    dejaUtilise = true;
                }
            }
            if(dejaUtilise){
                socket.emit("already-used-pseudo");
            } else {
                
                // Si le pseudo n'est pas utilisé
                for(var sessionID in sessions){
                    var userSession = sessions[sessionID];
                    
                    // Modification du surnom de l'utilisateur et envoi de validation
                    if(userSession.socket.id == socket.id){
                        userSession.pseudo = pseudoRequested;
                        socket.emit("login-valid");
                        console.log("User " + pseudoRequested + " registered");
                        
                    // Envoi du surnom aux autres utilisateurs
                    } else {
                        userSession.socket.emit("user-name", pseudoRequested);
                    }
                }
                
                // Si un socket admin est déjà connecté
                if(adminSocket){ adminSocket.emit("user-name", pseudoRequested); }
                
                // Si un socket show est connecté
                if(showSocket){ showSocket.emit("user-name", pseudoRequested); }
                 
                sendUserNamesRequest(socket);
            }
		});
	}
}

function admin (socket){
	adminSocket = socket;
	adminSession = socket.handshake.sessionID;
    pollAdmin.manageAdminPoll(socket, io);
    sendUserNamesRequest(socket);
	socket.emit("registered");
}

function show (socket){
    showSocket = socket;
    sendUserNamesRequest(socket);
    socket.emit("confirm-connection");
}

//  Envoi des pseudos de tous les utilisateurs
function sendUserNamesRequest(socket) {
    socket.on("ready-to-receive-users", function(){
        console.log("received request");
        for(var sessionID in sessions){
            var userSession = sessions[sessionID];
            console.log("sending ..", userSession.pseudo);
            socket.emit("user-name", userSession.pseudo);
        }
    });
}