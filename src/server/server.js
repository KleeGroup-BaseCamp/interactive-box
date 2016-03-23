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

var adminSocket, showSocket;
var sockets = {};

// Console log à la connexion d'un socket
io.on("connection", function(socket){
    console.log("Connexion du socket " + socket.handshake.sessionID);
});

// Traitement spécifique aux différents namespaces
var nspAdmin = appInit.nspAdmin;
nspAdmin.on('connection', function(socket){
	console.log("Admin socket " + socket.id);
	admin(socket);
});

var nspUsers = appInit.nspUsers;
nspUsers.on('connection', function(socket){
	console.log("User socket " + socket.id);
	user(socket);
});

var nspShowRoom = appInit.nspShowRoom;
nspShowRoom.on('connection', function(socket){
	console.log("Showman socket " + socket.id);
	show(socket);
});

// Déconnexion d'un socket d'utilisateur
function disconnectUser(socket){
    var pseudo = sockets[socket.id].pseudo;
    console.log("Déconnexion du socket de " + pseudo + ", id : " + socket.id);
    
    io.of("/user").emit("remove-user-name", pseudo);
    io.of("/admin").emit("remove-user-name", pseudo);
    io.of("/showRoom").emit("remove-user-name", pseudo);
    
    delete sockets[socket.id];
};



function user(socket){
    sockets[socket.id] = {socket:socket, pseudo:"Nick", loggedIn:false};
	pollUser.manageUserPoll(socket, io);
    socket.on("disconnect", function(){ disconnectUser(socket); });
    socket.on("login-request", function(pseudoRequested){
        console.log("Login request " + pseudoRequested +" ...");

        //Détection de pseudo déjà utilisé
        var dejaUtilise = false;
        for (var socketID in sockets){
            if (pseudoRequested == sockets[socketID].pseudo){
                dejaUtilise = true;
            }
        }
        if(dejaUtilise){
            socket.emit("already-used-pseudo");
        } else {
            for(var socketID in sockets){
                var userSession = sockets[socketID];

                // Modification du surnom de l'utilisateur et envoi de validation
                if(socketID == socket.id){
                    userSession.pseudo = pseudoRequested;
                    userSession.loggedIn = true;
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

function admin (socket){
	adminSocket = socket;
	adminSession = socket.handshake.sessionID;
    pollAdmin.manageAdminPoll(socket, io);
    sendUserNamesRequest(socket);
    socket.on ('disconnect', function(){adminSocket = undefined;});
	socket.emit("registered");
}

function show (socket){
    showSocket = socket;
    sendUserNamesRequest(socket);
    socket.on ('disconnect', function(){showSocket = undefined;});
    socket.emit("confirm-connection");
}

//  Envoi des pseudos de tous les utilisateurs
function sendUserNamesRequest(socket) {
    socket.on("ready-to-receive-users", function(){
        console.log("received request");
        for(var socketID in sockets){
            var userSession = sockets[socketID];
            if(userSession.loggedIn){
                console.log("sending ..", userSession.pseudo);
                socket.emit("user-name", userSession.pseudo);
            }
        }
    });
}