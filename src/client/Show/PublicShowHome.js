import io from 'socket.io-client';
import React from 'react';

import ShowQuestions from './ShowQuestions';
import PublicShowRoom from './PublicShowRoom';

const ROOM = 'room';
const QUESTION = 'question';
const FINISH = 'finish';

var PublicShowHome = React.createClass({
    socket: undefined,
    getInitialState: function(){
        return({status:ROOM});
    }, 
    componentWillMount: function(){

        var self = this;
        this.socket = io("/showRoom");

        this.socket.on("start-quizz", function(){
            if(self.state.status==ROOM || self.state.status==FINISH){ 
                self.setState({status:QUESTION});
            }
        }); 
        
        this.socket.on('abort-quizz', function(){
            if(self.state.status==QUESTION || self.state.status==FINISH){
                self.setState({status:ROOM});
            }
        });
        
        this.socket.on("end-questionnary", function(){
            if(self.state.status==QUESTION){
        	   self.setState({status:FINISH});
            }
        });
    },
    render: function(){
        if(this.state.status == ROOM) {
            return(<PublicShowRoom socket={this.socket}/>);
        } else if(this.state.status == QUESTION) {
            return(<PublicShowQuestions socket={this.socket}/>);
        } else if(this.state.status == FINISH){
            return(<p className="middle-content index-title-little">Merci de votre participation !</p>);
        } else {
            return(<p>Fatale erreur ! statut : {this.state.status}</p>);
        }
    }
});


export default PublicShowHome;