var appInit =  require('./app-init.js');
var io = appInit.io;
var fs = require('fs');
var path = require("path");
var QUESTIONNARIES_FILE = path.join(__dirname, '/questionnaries.json');
var questionnary;
var maxCount = 0;
var questionCount = 0;
var answerCount = 0;

var sessions = {};

var adminSocket, adminSession;

function user (socket){

    socket.join('clientRoom');
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
    
    // SENDING ANSWERS
    
    socket.on("MovedPage", function(){
        socket.emit("AskAnswers");
        console.log("emitted AskAnswers(2) to user on quizz");
    });
    
    socket.on("userWaitingForAnswers", function(){
            console.log("received answers demand from user, questionCount = " + questionCount);
        fs.readFile(QUESTIONNARIES_FILE, function(err, data) {
		    if (err) {
		      console.error(err);
		      process.exit(1);
		    }
		var questionnaries = JSON.parse(data);
		var length = questionnaries.length;
        for(var i=0;i<length;i++){
        	if(!questionnary){
	        	if(questionnaries[i].id == 0){
	        		questionnary = questionnaries[i];
	        		maxCount = questionnary.questions.length;
	        	}
        	}
        }
        //console.log("FOUND for user " + questionnary.title);

		});
            var ans = questionnary.questions[questionCount].answers;
            var answersList = [];
            for(var i=0;i<ans.length;i++){
	        	for (var j = 0; j<questionnary.answers.length; j++){
                    if (questionnary.answers[j].rid == ans[i]){
                        answersList.push(questionnary.answers[j].label);
                    }
                }
            }
            questionCount++;
            console.log("answers list for user is" + answersList);
			socket.emit("answers", answersList); 
            console.log("sent answers to user");
	});
    socket.on("answers", function(answers){
        console.log("serveur on client session sent answers, as received from admin session of server");
       socket.emit("answers", answers); 
    });
}


//ADMIN

function admin (socket){
    
    socket.join('adminRoom');

	console.log("ADMIN connects : " + socket.handshake.sessionID + " via socket " + socket.id);

	adminSocket = socket;
	adminSession = socket.handshake.sessionID;

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
       // console.log("FOUND " + questionnary.title);
		socket.emit("goToPollPage");

		});
        io.to('clientRoom').emit("goToPollPage");
        console.log("sentQuestionnary to client");
	});

	socket.on("readyToReceiveQuestion", function(){
        console.log("received READY TO RECEIVE QUESTION");
		if(questionCount<maxCount){
			socket.emit("question", questionnary.questions[questionCount]);
		} else {
			socket.emit("no-more-questions");
		}
	});
    
    socket.on("readyToReceiveAnswers", function(list){
            console.log("received answers demand" + list);
            var answersList = [];
            for(var i=0;i<list.length;i++){
	        	for (var j = 0; j<questionnary.answers.length; j++){
                    if (questionnary.answers[j].rid == list[i]){
                        answersList.push(questionnary.answers[j].label);
                    }
                }
            }
            console.log("answers list is" + answersList);
			socket.emit("answers", answersList); 
            io.to('clientRoom').emit("AskAnswers");
                console.log("sent AskAnswers to user from readytoreceive answers admin");
            //socket.on("userWaitingForAnswers", function(){
                
           // });
            
            console.log("incremented questionCount");
            console.log("sent answers to admin");
	});
    /*socket.on("AskAnswers", function(){
       console.log("received AskAnswers from admin");
        io.to('clientRoom').emit("AskAnswers2"); 
        
        console.log("emitted AskAnswers to client room");
    });*/

	socket.emit("registered");
}


io.on("connection", function(socket){
	socket.emit("who are you ?");
	console.log("Connection of socket " + socket.id);
	socket.on("admin", function(){admin(socket);});
	socket.on("user", function(){user(socket);});
    socket.on("user-quizz", function(){userquizz(socket);});
    
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
