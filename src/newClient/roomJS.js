import React from 'react';


var RoomBox = React.createClass({
	getInitialState: function(){
		return{answersLabels:[]};
	},
	componentDidMount: function(){
		var t  = this;
		this.props.socket.on("question", function(answersLabels){
            t.setState({answersLabels:answersLabels});
        });
	},
	renderQuestion: function(){
		var indexOfAnswer = -1;
		var t = this;
        var answersNodes = this.state.answersLabels.map(function(label) {
        	indexOfAnswer++;
        	var index = indexOfAnswer;
        	var chooseAnswer = function(){
        		t.props.socket.emit("answer", index);
        	};
        	return(<li><button className="answer-button" onClick={chooseAnswer}>{label}</button></li>);
        });
		return(
			<div className="middle-content">
				<ul>{answersNodes}</ul>
			</div>
		);
	},
	renderRoom: function(){
		return(
		    <div className="middle-content">
		        <h1 className="index-title">On attend les autres ...</h1>
		        <RoomiesList socket={this.props.socket}/>
		    </div>
	    );
	},
	render: function(){
	 	if(this.state.answersLabels.length==0){
			return this.renderRoom();
		} else {
			return this.renderQuestion();
		}
	}
});

var RoomiesList = React.createClass({
	getInitialState: function() {
	    return {users: []};
	},
	componentDidMount: function() {
		var component = this;
		var t = this;
		var socket = this.props.socket;

		socket.on("registered", function(){
			socket.on("userName", function(userName){
	    		component.addElement(userName);
	    	});
	    	socket.emit("readyToReceiveUsers");
	    	socket.on("launch-quizz", function(){
	        	socket.emit("ready-to-receive-question");
	        });
		});
	},
	addElement: function(userName){
		this.setState(function(previousState, currentProps){
			var prevUsers = previousState.users;
			prevUsers.push(userName);
	    	return {users: prevUsers};
	    });
	},
	render: function(){
	var roomiesList = this.state.users.map(function(userName) {
	      return (<li>{userName}</li>);
	    });
	    return (
	      <div>
		      <ul> Personnes présentes dans la salle : {roomiesList}</ul>
	      </div>
	    );
	}
});

/*ReactDOM.render(
  <RoomBox/>,
  document.getElementById('content')
);*/

export default RoomBox;