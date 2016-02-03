import React from 'react';

/*
    RoomCounter est un composant qui compte le nombre d'utilisateurs dans la room
    
    Props : 
        socket : Le socket qui reçoit les nouveaux utilisateurs, sous la forme d'un message "userName"
        
    State : 
        usersCount : Le nombre d'utilisateurs actuel
        
    TODO gérer la déconnexion d'un utilisateur
    
*/


var RoomCounter = React.createClass({
	getInitialState: function() {
	    return {usersCount: 0};
	},
	componentDidMount: function() {
		var t = this;
		var socket = this.props.socket;
        socket.on("userName", function(userName){
            t.setState({usersCount:t.state.usersCount+1});
        });
	},
	render: function(){
        return(
            <span>
                {this.state.usersCount}
            </span>
        );
	}
});

export default RoomCounter;