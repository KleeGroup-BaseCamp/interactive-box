import React from 'react';
import Answers from '../newClient/answers';

const ROOM="waiting";
const QUESTION="question";
const FINISHED="finished";
var firsts;

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
		        <h1 className="index-title">On attend les autres ...</h1>
		        <RoomiesList socket={this.props.socket}/>
		    </div>
	    );
	},
	render: function(){
	 	if(this.state.currentState==ROOM){
			return this.renderRoom();
		} else if(this.state.currentState==FINISHED){
            return (<p className="middle-content">"The quizz is over !"</p>);
        } else if(this.state.currentState==QUESTION){
            return <Answers socket={this.props.socket} firsts={firsts}/>;
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