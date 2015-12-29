import io from 'socket.io-client';
import React from 'react';


var RoomBox = React.createClass({

  render: function(){
    return(
      <div>
        <h1 className="index-title">Bienvenue dans la room?</h1>
        <RoomiesList/>
      </div>
    );
  }
});

var RoomiesList = React.createClass({
	getInitialState: function() {
	    return {users: []};
	},
	componentDidMount: function() {
		var component = this;
		console.log("DID mount");

		var socket = io.connect();
		socket.emit("user");
		console.log("sent user");
		socket.on("registered", function(){
            console.log("received registered");
			socket.on("userName", function(userName){
	    		component.addElement(userName);
	    		console.log("I've received " + userName);
	    	});
	    	socket.emit("readyToReceiveUsers");
            console.log("I've sent readyToReceiveUsers");
	    	socket.on("startPoll", function(){
	    		console.log("I've received a poll");
	    	});
		});
        socket.on("goToPollPage", function(){
            window.location+="/quizz";
            socket.emit("MovedPage");
        });
        

	},
	addElement: function(userName){
		console.log("Adding : " + userName);
		this.setState(function(previousState, currentProps){
			var prevUsers = previousState.users;
			prevUsers.push(userName);
	    	return {users: prevUsers};
	    });
	},
	render: function() {
		console.log("RENDER");
	    var rommiesList = this.state.users.map(function(userName) {
	      return (
	        <li>{userName}</li>
	      );
	    });
	    return (
	      <div>
	      <ul> Personnes présentes dans la salle : 
	        {rommiesList}
	      </ul>
	      </div>
	    );
  }
});

/*ReactDOM.render(
  <RoomBox/>,
  document.getElementById('content')
);*/

export default RoomBox;