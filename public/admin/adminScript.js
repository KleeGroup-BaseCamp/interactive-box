var questions = [];
var addQuestionButton, resetButton, saveButton, removeQuestionButton, addAnswerButton, questionsList, questionTitle, templateButton, launchButton;
var lookedQuestion;

document.addEventListener("DOMContentLoaded", function() {
   
   var socket  = io.connect();
   socket.emit("admin");

   addQuestionButton = document.getElementById("addQuestionButton");
   removeQuestionButton = document.getElementById("removeQuestionButton");
   addAnswerButton = document.getElementById("addAnswerButton");
   questionsList = document.getElementById("questionsList");
   answersList = document.getElementById("answersList");
   questionTitle = document.getElementById("questionTitle");
   saveButton = document.getElementById("saveButton");
   templateButton = document.getElementById("templateButton");
   launchButton = document.getElementById("launchButton");
   resetButton = document.getElementById("resetButton");



   addQuestionButton.onclick = function(){
      var questionNode = document.createElement("li");
      var question = new Question();  
      question.setNode(questionNode);
      question.setTitle("What's up ?");
      questionsList.appendChild(questionNode);
      questions.push(question);
   };

   removeQuestionButton.onclick = function(){
   if(lookedQuestion){
      questionsList.removeChild(lookedQuestion.node);
      var index = questions.indexOf(lookedQuestion);
      var newQuestion = questions.length===1 ? undefined : index === 0 ? questions[1] : questions[index-1];
      setCurrentQuestion(newQuestion);
      questions.splice(index, 1);
   }
   };

   addAnswerButton.onclick = function(){
      if(lookedQuestion){
         if(lookedQuestion.answers.length<6){
            addAnswerControl(lookedQuestion.addAnswer());
         }
      }
   };

   saveButton.onclick = function(){save();};
   templateButton.onclick = function(){template();};
   resetButton.onclick = function(){
      while(questionsList.childNodes.length>0){
         questionsList.removeChild(questionsList.firstChild);
         questions.splice(0,1);
      }
   };

   launchButton.onclick = function(){
      socket.emit("submitPoll", questions);
   };
   
});

function createQuestion(title){
   var questionNode = document.createElement("li");
   var question = new Question();  
   question.setNode(questionNode);
   question.setTitle(title);
   questionsList.appendChild(questionNode);
   questions.push(question);
   return question;
}

function createTemplateQuestion(title, answerTable){
   var question = createQuestion(title);
   for(answer in answerTable){
      question.answers.push(new Answer(answerTable[answer])); 
   }
   return question;
}

function template(){
   createTemplateQuestion("Quelle est votre couleur préférée ?", ["Rouge", "Bleu", "Vert", "Orange", "Jaune", "Violet"]);
   createTemplateQuestion("Quelle est votre boisson préférée ?", ["Vin rouge", "Vin blanc", "Jus d'orange", "Coca", "Grenadine"]);
   createTemplateQuestion("Qui est le plus fort ?", ["Superman", "Batman", "Actionman"]);
}

function save(){

console.log(questions);
// TODO implement saving
}

function setCurrentQuestion(question){

   while (answersList.firstChild) {
      answersList.removeChild(answersList.firstChild);
   }

   if(question){
      if(lookedQuestion){
         lookedQuestion.node.className = "questionCell notSelected";
      }
      question.node.className = "questionCell selected";

      // TITLE
      questionTitle.value = question.title;
      questionTitle.onchange = function(){
         question.setTitle(questionTitle.value);
      };

      // ANSWERS
      for(var i=0;i<question.answers.length;i++){
         addAnswerControl(question.answers[i]);
      }

   } else {
         questionTitle.onchange = function(){};
         questionTitle.value = "";
   }
   lookedQuestion = question;
}

function addAnswerControl(answer){
   var answerInput = document.createElement("input");
   answerInput.value = answer.title;
   answerInput.onchange = function(){
      answer.title = answerInput.value;
   };
   answerInput.className = "answerInput";

   var answerDeleteButton = document.createElement("button");
   answerDeleteButton.innerText = "x";
   answerDeleteButton.onclick = function(){
      lookedQuestion.deleteAnswer(answer);
      answersList.removeChild(answerLi);
   };

   
   var answerLi = document.createElement("li");
   answerLi.appendChild(answerInput);
   answerLi.appendChild(answerDeleteButton);
   answersList.appendChild(answerLi);
}

function Question () {
   this.title = "undefined question";
   this.answers = [];
   
   this.setTitle = function (newValue){
      this.title = newValue;
      this.node.innerText = newValue;
   };

   this.setNode = function(newNode){
      this.node = newNode;
      var self = this;
      this.node.onclick = function(){
         setCurrentQuestion(self);
      };
      newNode.className = "questionCell notSelected"
   };

   this.addAnswer = function(){
      var answer = new Answer("Answer " + (this.answers.length+1));
      this.answers.push(answer);
      return answer;
   };

   this.deleteAnswer = function(answer){
      var index = this.answers.indexOf(answer);
      if(index!=-1){
         this.answers.splice(index, 1);
      }
   }
}

function Answer (title) { 
    this.title = title;
}