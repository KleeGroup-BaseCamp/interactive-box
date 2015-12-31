var fs = require('fs');
var path = require("path");
var pollUser = require("./poll-user.js");

var QUESTIONNARIES_FILE = path.join(__dirname, '/questionnaries.json');

var currentQuestionnary;
var currentIndex = (-1);

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
	        		questionnary = questionnaries[i];
	        	}
	        }
	    }
	});
};

function manageAdminPoll(adminSocket, io){
	console.log("IVE SEEN THAT MAN");

	adminSocket.on("launch-quizz", function(idOfQuestionnary){
		currentIndex = -1;
		readQuestionnary(idOfQuestionnary);
		pollUser.reset();
		io.of('/user').emit('launch-quizz');
		console.log("emit launch quizz to user sockets");
	});

	adminSocket.on("question", function(){
		if(questionnary){
			currentIndex++;						//TODO checker l'index

			//Récupère les réponses
			var question = currentQuestionnary.questions[currentIndex];
			var answersIds = question.answers;
            var answersList = [];
            for(var i=0;i<answersIds.length;i++){
	        	for (var j = 0; j<currentQuestionnary.answers.length; j++){
                    if (currentQuestionnary.answers[j].rid == answersIds[i]){
                        answersList.push(currentQuestionnary.answers[j].label);
                    }
                }
            }

            // Envoie les réponses
			io.sockets.in("/user").emit("question", answersList);
		}
	});

	adminSocket.on("end-time", function(){io.sockets.in("/user").emit("end-time")});
	
	adminSocket.on("end-questionnary", function(){io.sockets.in("/user").emit("end-questionnary")});

}

exports.manageAdminPoll = manageAdminPoll;