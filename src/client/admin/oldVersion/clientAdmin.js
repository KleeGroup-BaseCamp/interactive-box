document.addEventListener("DOMContentLoaded", function() {
   
   var socket  = io.connect();
   socket.emit("admin");

   var sendButton = document.getElementById("sendButton");
   var startButton = document.getElementById("startButton");
   var title = document.getElementById("title");
   var r1 = document.getElementById("r1");
   var r2 = document.getElementById("r2");
   var r3 = document.getElementById("r3");
   var questionsList = document.getElementById("preguntasList");
   
   sendButton.onclick=function(){

      socket.emit("submitNewQuestion", {question:title.value, answers:[r1.value, r2.value, r3.value]});

      var createdQuestion = document.createElement("li");
      createdQuestion.innerText = title.value;
      questionsList.appendChild(createdQuestion);

      r1.value="";
      r2.value="";
      r3.value="";
      title.value="";
   };

   startButton.onclick = function(){
      socket.emit("startQuizz");
   };
});