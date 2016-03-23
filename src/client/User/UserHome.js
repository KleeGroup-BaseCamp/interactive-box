import io from 'socket.io-client';
import React from 'react';

import LoginView from './LoginView';
import UserRoom from './UserRoom';
import AnswersList from './AnswersList';

const LOGIN = 'login';
const ROOM = 'room';
const QUESTION = 'question';
const FINISH = 'finish';

var UserHome = React.createClass({
    socket: undefined,
    getInitialState: function(){
        return({status:LOGIN});
    }, 
    componentWillMount: function(){

        //Init
        var self = this;
        this.socket = io("/user");

        //Passage de login à room
        this.socket.on("login-valid", function(){
            self.setState({status:ROOM});
        });

        //Passage de room à question
        this.socket.on("start-quizz", function(){
            self.setState({status:QUESTION});
        }); 
        
        //Passage de question à finished
        this.socket.on("end-questionnary", function(){
        	self.setState({status:FINISH});
        });
    },
    render: function(){
        if(this.state.status == LOGIN) {
            return(<LoginView socket={this.socket}/>);
        } else if(this.state.status == ROOM) {
            return(<UserRoom socket={this.socket}/>);
        } else if(this.state.status == QUESTION) {
            return(<AnswersList socket={this.socket}/>);
        } else if(this.state.status == FINISH){
            return(<p className="middle-content index-title-little">Merci de votre participation !</p>);
        } else {
            return(<p>Fatale erreur ! statut : {this.state.status}</p>);
        }
    }
});


export default UserHome;