var pseudoInput;

document.addEventListener("DOMContentLoaded", function() {
   
   var continueButton = document.getElementById("continueButton");
   pseudoInput = document.getElementById("pseudo");

  	continueButton.disabled = pseudoInput.value.length==0;

	pseudoInput.addEventListener("keyup", function(){
		continueButton.disabled = pseudoInput.value.length==0;
	});

	pseudoInput.addEventListener("keydown", function(e){
		if(e.keyCode == 13 && pseudoInput.value.length!=0){
			connect();
		}
	});

   continueButton.onclick=connect;
   
});

function connect(){
	var pseudo = pseudoInput.value;
	var socket  = io.connect();
	socket.emit("user");
	socket.emit("loginRequest", pseudo);
	socket.on("loginValid", function(){
		window.location+="room";
	});
}