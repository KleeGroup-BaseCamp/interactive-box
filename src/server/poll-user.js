var numberOfReadyUsers = 0;

function manageUserPoll(userSocket, io){

	userSocket.on("answer", function(indexOfAnswer){
		io.of('/showRoom').emit("answer", indexOfAnswer);
		io.of('/admin').emit("answer", indexOfAnswer);
        console.log("I emitted an answer to admin");
	});

	userSocket.on("ready-to-receive-question", function(){
		numberOfReadyUsers++;
		console.log("RECEIVED A READY");

		var nRoom = 0;

		Object.keys(io.nsps['/user'].connected).forEach(function(socketID) {
    		nRoom++;
		});

		if(nRoom = numberOfReadyUsers){
			console.log("Tout le monde est prêt");
			io.of('/admin').emit("all-users-are-ready");
		} else {
			console.log("Tout le monde n'est pas prêt");
		}


	});
}

function reset(){
	numberOfReadyUsers = 0;
}

exports.manageUserPoll = manageUserPoll;
exports.reset = reset;