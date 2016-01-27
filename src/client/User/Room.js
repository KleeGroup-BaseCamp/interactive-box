import React from 'react';
import AnswersList from './AnswersList';
import RoomList from "../Utils/RoomList";

const ROOM="waiting";
const QUESTION="question";
const FINISHED="finished";
var firsts;

import "./Room.css"

var RoomBox = React.createClass({
	getInitialState: function(){
		return{currentState:ROOM};
	},
	componentDidMount: function(){
        var t = this;
        var socket = t.props.socket;
        socket.on("end-questionnary", function(){
        	t.setState({currentState:FINISHED});
        });
        this.props.socket.on("question", function(data){
            firsts = data;
            t.setState({currentState:QUESTION});
        }); 
        socket.on("registered", function(){
	    	socket.emit("readyToReceiveUsers");
	    	socket.on("launch-quizz", function(){
	        	socket.emit("ready-to-receive-question");
	        });
		});
	},
	renderRoom: function(){
		return(
		    <div className="middle-content">
		        <h1 className="index-title-little">On attend juste les autres</h1>
                <RoomList socket={this.props.socket} maxNumber={10} intervalMS={300}/>
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

export default RoomBox;