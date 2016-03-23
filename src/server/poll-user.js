var numberOfReadyUsers = 0;
var totalAmountOfUsers = 0;
var ioReference = undefined;

function manageUserPoll(userSocket, io){
    ioReference = io;
    
	userSocket.on("answer", function(indexOfAnswer){
		io.of('/showRoom').emit("answer", indexOfAnswer);
		io.of('/admin').emit("answer", indexOfAnswer);
        console.log("I emitted an answer to admin");
	});

	userSocket.on("ready-to-start-quizz", function(){
		numberOfReadyUsers++;
		console.log("RECEIVED READY from a user socket");
		if(totalAmountOfUsers = numberOfReadyUsers){
			console.log("Tout le monde est prêt");
			io.of('/admin').emit("all-users-are-ready");
		}
	});
    
    userSocket.on("end-time-request", function(){
        io.of('/admin').emit("end-time-request");
    });
}

function reset(){
	numberOfReadyUsers = 0;
    totalAmountOfUsers = 0;
    Object.keys(ioReference.nsps['/user'].connected).forEach(function(socketID) {
        totalAmountOfUsers++;
    });
    console.log("Waiting answer from " + totalAmountOfUsers + " users");
}

exports.manageUserPoll = manageUserPoll;
exports.reset = reset;