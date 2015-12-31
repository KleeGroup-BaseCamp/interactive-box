var fs = require('fs');
var path = require("path");
var pollUser = require("./poll-user.js");

var QUESTIONNARIES_FILE = path.join(__dirname, '/questionnaries.json');

var currentQuestionnary;


function readQuestionnary(idOfQuestionnary){
	 fs.readFile(QUESTIONNARIES_FILE, function(err, data) {
	    if (err) {
	      console.error(err);
	      process.exit(1);
	    } else {
			var questionnaries = JSON.parse(data);
			var length = questionnaries.length;
	        for(var i=0;i<length;i++){
	        	if(questionnaries[i].id == idOfQuestionnary){
	        		currentQuestionnary = questionnaries[i];
	        	}
	        }
	    }
	});
};

function manageAdminPoll(adminSocket, io){
	adminSocket.on("launch-quizz", function(idOfQuestionnary){
		readQuestionnary(idOfQuestionnary);
		pollUser.reset();
		io.of('/user').emit('launch-quizz');
	});

	adminSocket.on("question", function(answersLabels){
		io.of("/user").emit("question", answersLabels);
	});

	adminSocket.on("end-time", function(){io.sockets.in("/user").emit("end-time")});
	
	adminSocket.on("end-questionnary", function(){io.sockets.in("/user").emit("end-questionnary")});

}

exports.manageAdminPoll = manageAdminPoll;