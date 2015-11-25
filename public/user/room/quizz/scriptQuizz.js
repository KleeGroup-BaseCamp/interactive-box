document.addEventListener("DOMContentLoaded", function() {
	var socket = io.connect();

	socket.on("who are you ?", function(){
		socket.emit("user");
	});

	socket.on("confirmConnection", function(){
		socket.emit("readyToReceiveQuestion");
	});
});
