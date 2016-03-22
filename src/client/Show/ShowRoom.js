import io from 'socket.io-client';
import React from 'react';
import ShowQuestion from './ShowQuestions';
import RoomList from '../Utils/RoomList'

const ROOM="waiting";
const QUESTION="question";
const FINISHED="finished";

var firsts;

import "./Room.css"

var ShowRoomBox = React.createClass({
    socket:undefined,
	getInitialState: function(){
		return{currentState:ROOM};
	},
    componentWillMount: function(){
        this.socket = io("/showRoom");
    },
	componentDidMount: function(){
        var t = this;    
        this.socket.on("end-questionnary", function(){
        	t.setState({currentState:FINISHED});
            firsts=undefined;
        });
        this.socket.on("question-show", function(answersLabels){
            firsts = answersLabels;
            t.setState({currentState:QUESTION});
        });
	},
	renderRoom: function(){
		return(
		    <div className="middle-content">
		        <h1 className="index-title-little">On attend juste les autres</h1>
		        <RoomList socket={this.socket} maxNumber={2} intervalMS={1000}/>
		    </div>
	    );
	},
	render: function(){
	 	if(this.state.currentState==ROOM){
			return this.renderRoom();
		} else if(this.state.currentState==FINISHED){
            return (<p className="middle-content index-title-little">Merci de votre participation !</p>);
        } else if(this.state.currentState==QUESTION){
            return <ShowQuestion socket={this.socket} firsts={firsts}/>;
        } else {
            return (<p>Erreur !</p>);
        }
	}
});

export default ShowRoomBox;