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
    adminSocket.on("ready-to-receive-user-count", function(){
       	var nRoom = 0;
		Object.keys(io.nsps['/user'].connected).forEach(function(socketID) {
    		nRoom++;
		}); 
        console.log("Received ready, i send ");
        console.log(nRoom);
        adminSocket.emit("fix-count", nRoom);
    });
	adminSocket.on("launch-quizz", function(idOfQuestionnary){
		readQuestionnary(idOfQuestionnary);
		pollUser.reset();
		io.of('/user').emit('start-quizz');
		io.of('/showRoom').emit('start-quizz');
        
	});

	adminSocket.on("question", function(data){
		io.of("/user").emit("question", data);
		io.of("/showRoom").emit("question", data);
	});
    adminSocket.on("question-show", function(data){
		io.of("/showRoom").emit("question-show", data);
	});
    adminSocket.on("showBarChart", function(){
        io.of("/showRoom").emit("showBarChart");
    });
    adminSocket.on("chartData", function(newData){
        io.of("/showRoom").emit("chartData", newData);
    });
	adminSocket.on("good-answers", function(arrayOfGoodAnswers){
        io.of("/user").emit("good-answers", arrayOfGoodAnswers);
        io.of("/showRoom").emit("good-answers", arrayOfGoodAnswers);
    });
	adminSocket.on("end-questionnary", function(){
        io.of("/user").emit("end-questionnary");
        io.of("/showRoom").emit("end-questionnary");
    });
    adminSocket.on("mail-box", function(){
        io.of("/user").emit("mail-box"); 
    });
}

exports.manageAdminPoll = manageAdminPoll;