import React from 'react';


var RoomBox = React.createClass({

  render: function(){
    return(
      <div className="middle-content">
        <h1 className="index-title">On attend les autres ...</h1>
        <RoomiesList socket={this.props.socket}/>
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

		var socket = this.props.socket;

		socket.on("registered", function(){
			socket.on("userName", function(userName){
	    		component.addElement(userName);
	    	});
	    	socket.emit("readyToReceiveUsers");
	    	socket.on("launch-quizz", function(){
	        	console.log("J'envoie que je suis pret.");
	        	socket.emit("ready-to-receive-question");
	        });
		});

        socket.on("goToPollPage", function(){
            window.location+="/quizz";
            socket.emit("MovedPage");
        });

	},
	addElement: function(userName){
		this.setState(function(previousState, currentProps){
			var prevUsers = previousState.users;
			prevUsers.push(userName);
	    	return {users: prevUsers};
	    });
	},
	render: function() {
	    var roomiesList = this.state.users.map(function(userName) {
	      return (
	        <li>{userName}</li>
	      );
	    });
	    return (
	      <div>
	      <ul> Personnes présentes dans la salle : 
	        {roomiesList}
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