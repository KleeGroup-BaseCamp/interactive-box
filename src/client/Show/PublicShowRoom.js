import io from 'socket.io-client';
import React from 'react';

import RoomList from '../Utils/RoomList'

import "./Room.css"

var PublicShowRoom = React.createClass({
	render: function(){
		return(
		    <div className="middle-content">
		        <h1 className="index-title-little">En attente dutilisateurs</h1>
		        <RoomList socket={this.props.socket} maxNumber={10} intervalMS={4000}/>
		    </div>
	    );
	}
});

export default PublicShowRoom;