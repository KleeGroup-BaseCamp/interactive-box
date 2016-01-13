var fs = require('fs');
var path = require("path");
var pollUser = require("./poll-user.js");
var pollAdmin = require("./poll-admin.js");

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

function manageShowPoll(adminSocket, io){
    console.log("opened manageSHowPoll");
	adminSocket.on("launch-quizz", function(idOfQuestionnary){
		readQuestionnary(idOfQuestionnary);
	});

	adminSocket.on("question", function(data){
		io.of("/showRoom").emit("question", data);
        console.log("emitted question to showroom");
	});

	adminSocket.on("end-time", function(){io.of("/showRoom").emit("end-time")});
	
	adminSocket.on("end-questionnary", function(){io.of("/showRoom").emit("end-questionnary")});

}

exports.manageShowPoll = manageShowPoll;