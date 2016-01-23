import io from 'socket.io-client';
import React from 'react';
import ShowQuestion from './ShowQuestions';

const ROOM="waiting";
const QUESTION="question";
const FINISHED="finished";
var firsts;
var socket;

import "./style/Room.css"

var ShowRoomBox = React.createClass({
	getInitialState: function(){
		return{currentState:ROOM};
	},
	componentDidMount: function(){
        var t = this;    
        socket.on("end-questionnary", function(){
        	t.setState({currentState:FINISHED});
        });
        socket.on("question-show", function(answersLabels){
            firsts = answersLabels;
            t.setState({currentState:QUESTION});
        });
	},
	renderRoom: function(){
		return(
		    <div className="middle-content">
		        <h1 className="index-title-little">On attend juste les autres</h1>
		        <RoomiesList socket={socket}/>
		    </div>
	    );
	},
	render: function(){
	 	if(this.state.currentState==ROOM){
			return this.renderRoom();
		} else if(this.state.currentState==FINISHED){
            return (<p className="middle-content index-title-little">Le quizz est fini</p>);
        } else if(this.state.currentState==QUESTION){
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
		var t = this;
        socket = io("http://localhost:8080/showRoom");
		socket.on("userName", function(userName){
            console.log("Received : " + userName);
	   t.addElement(userName);
	   });
	   socket.emit("readyToReceiveUsers");
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
	      return (<li className="user-name" key={userName}>{userName}</li>);
	    });
	    return (
	      <div>
		      <ul>{roomiesList}</ul>
	      </div>
	    );
	}
});

export default ShowRoomBox;