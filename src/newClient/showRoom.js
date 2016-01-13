import io from 'socket.io-client';
import React from 'react';
import ShowQuestion from '../newClient/show-questions';

const ROOM="waiting";
const QUESTION="question";
const FINISHED="finished";
var firsts;
var socket;

var RoomBox = React.createClass({
	getInitialState: function(){
		return{currentState:ROOM};
	},
	componentDidMount: function(){
        var t = this;
        console.log("i mounted");
        
        socket.on("end-questionnary", function(){
        	t.setState({currentState:FINISHED});
        });
        socket.on("launch-quizz", function(){
	        	socket.emit("ready-to-receive-question");
	        });
        socket.on("question", function(answersLabels){
            firsts = answersLabels;
            t.setState({currentState:QUESTION});
            console.log("i have set state to QUESTION")
        });  
	},
	renderRoom: function(){
		return(
		    <div className="middle-content">
		        <h1 className="index-title">On attend les autres ...</h1>
		        <RoomiesList socket={socket}/>
		    </div>
	    );
	},
	render: function(){
	 	if(this.state.currentState==ROOM){
			return this.renderRoom();
		} else if(this.state.currentState==FINISHED){
            return (<p className="middle-content">"The quizz is over !"</p>);
        } else if(this.state.currentState==QUESTION){
                console.log("tried to open Answers");
            return <ShowQuestion socket={socket} firsts={firsts}/>;
        } else {
            return (<p>Erreur !</p>);
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
        socket = io("http://localhost:8080/showRoom");
		socket.on("userName", function(userName){
	    		component.addElement(userName);
	    	});
	   socket.emit("readyToReceiveUsers");
        console.log("j'ai émis readyToReceiveUsers");
	   socket.on("launch-quizz", function(){
	       socket.emit("ready-to-receive-question");
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
		      <ul> Personnes presentes dans la salle : {roomiesList}</ul>
	      </div>
	    );
	}
});

export default RoomBox;