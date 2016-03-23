import React from 'react';

import RoomList from "../Utils/RoomList";
import SimpleCounter from '../Utils/SimpleCounter'

import "./Room.css"

var UserRoom = React.createClass({
	render: function(){
		return(
		    <div className="middle-content">
		        <h1 className="index-title-little">On attend juste les autres</h1>
                <RoomList socket={this.props.socket} maxNumber={10} intervalMS={3000}/>
		    </div>
	    );
	}
});

export default UserRoom;