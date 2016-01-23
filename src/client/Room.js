import React from 'react';
import AnswersList from './AnswersList';

const ROOM="waiting";
const QUESTION="question";
const FINISHED="finished";
var firsts;

import "./style/Room.css"

var RoomBox = React.createClass({
	getInitialState: function(){
		return{currentState:ROOM};
	},
	componentDidMount: function(){
        var t = this;
        this.props.socket.on("end-questionnary", function(){
        	t.setState({currentState:FINISHED});
        });
        this.props.socket.on("question", function(data){
            firsts = data;
            t.setState({currentState:QUESTION});
        }); 
	},
	renderRoom: function(){
		return(
		    <div className="middle-content">
		        <h1 className="index-title-little">On attend juste les autres</h1>
		        <RoomiesList socket={this.props.socket}/>
		    </div>
	    );
	},
	render: function(){
	 	if(this.state.currentState==ROOM){
			return this.renderRoom();
		} else if(this.state.currentState==FINISHED){
            return (<p className="middle-content index-title-little">Le quizz est terminé</p>);
        } else if(this.state.currentState==QUESTION){
            return <AnswersList socket={this.props.socket} firsts={firsts}/>;
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
		var socket = this.props.socket;

		socket.on("registered", function(){
			socket.on("userName", function(userName){
	    		t.addElement(userName);
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
	      return (<li className="user-name" key={userName}>{userName}</li>);
	    });
	    return (
	      <div>
		      <ul>{roomiesList}</ul>
	      </div>
	    );
	}
});

/*ReactDOM.render(
  <RoomBox/>,
  document.getElementById('content')
);*/

export default RoomBox;