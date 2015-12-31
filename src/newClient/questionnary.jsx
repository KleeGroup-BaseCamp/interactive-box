import React from 'react';

var socket;


var QuestionnaryDeveloped = React.createClass({
	getInitialState: function(){
		return {okToStart:false, questionIndex:-1}
	},
	componentDidMount: function(){
		var t = this;
		socket = this.props.socket;
		socket.on("all-users-are-ready", function(){
			t.setState({okToStart:true});
		});
		socket.emit("launch-quizz", this.props.questionnary.qid);
		socket.on("answer", function(indexOfAnswer){
			console.log("Receivend answer " + indexOfAnswer);
		});
	},
	incrementCounter: function(){
		var oldQuestionIndex = this.state.questionIndex;
		this.setState({questionIndex:oldQuestionIndex+1});
	},
  	_renderWaitPage() {
  		var startButton = <button className="index-button" onClick={this.incrementCounter}>Start !</button>;
  		var waitMessage = <p> En attente de tous les utilisateurs ...</p>
  		return this.state.okToStart ? startButton : waitMessage;
	},
	_renderQuizzPage(){
		var questionnary = this.props.questionnary;
		var maxIndex = questionnary.questions.length;
		if(this.state.questionIndex<maxIndex){
			var question = questionnary.questions[this.state.questionIndex];
			var questionTitle = question.text;
	        var answersLabels = [];
			var answersIds = question.answers;
			var answersObjects = questionnary.answers;
	        for(var i=0;i<answersIds.length;i++){
	        	for (var j = 0; j<answersObjects.length; j++){
	                if (answersObjects[j].rid == answersIds[i]){
	                    answersLabels.push(answersObjects[j].label);
	                }
	            }
	        }
	        socket.emit("question", answersLabels);
	        var answersNodes = answersLabels.map(function(label) {
	        	return(
		        	<li>
		                <p>{label}</p>
		            </li>);
	        });

			return (
				<div>
					<p>{questionTitle}</p>
					<ul>
						{answersNodes}
					</ul>
					<button className="index-button" onClick={this.incrementCounter}>Next</button>
				</div>
			);
		} else {
			socket.emit("end-questionnary");
			return (<p> It is over </p>);
		}
	},
	//TODO ajouter le compte des utilisateurs
  	render: function(){
	    var content = this.state.questionIndex>-1 ? this._renderQuizzPage() : this._renderWaitPage();
	    return(
	        <div>
	        	<h1>{this.props.questionnary.title}</h1>
	   			{content}
	        </div>
	    );
  	}
});

export default QuestionnaryDeveloped;