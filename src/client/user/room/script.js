document.addEventListener("DOMContentLoaded", function() {
   
	var usersList = document.getElementById("usersList");
	var socket = io.connect();

	socket.on("who are you ?", function(){
		socket.emit("user");
	});

	socket.on("confirmConnection", function(){
		socket.on("userName", function (data){
			var element = document.createElement("li");
			element.innerText = data;
			usersList.appendChild(element);
			console.log("NEW username : " + data);
		});

		socket.on("startPoll", function(){
			window.location+="quizz";
		});

		socket.emit("readyToReceiveUsers");
	});

});
