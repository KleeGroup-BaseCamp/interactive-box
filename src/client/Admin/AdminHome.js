import io from 'socket.io-client';
import React from 'react';

import AdminView from './AdminView';
import WaitPage from './WaitPage';
import Questionnary from './Questionnary';
import EndPage from './EndPage';

const INDEX = 'index';
const WAIT = 'wait';
const QUESTIONNARY = 'questionnary';
const END = 'end';

const titleStyle = {
    paddingTop:'3%',
    fontSize:'5vmin', 
};

var AdminHome = React.createClass({
    socket: undefined,
    getInitialState: function(){
        return({status:INDEX, questionnaryLaunched:undefined});
    }, 
    componentWillMount: function(){
        var self = this;
        this.socket = io("/admin");
    },
    redirect: function(){
        this.setState({status: INDEX, questionnaryLaunched:undefined});
    },
    goToEnd: function(){
        this.setState({status:END});
        this.socket.emit('end-questionnary');
    },
    launchQuestionnary: function(questionnary){
        console.log("try to set state to wait");
        this.setState({status: WAIT, questionnaryLaunched: questionnary});
        console.log("set state to wait");
        this.socket.emit("launch-quizz", questionnary.qid);
        console.log("emitted launch quizz");
    },
    startQuestionnary: function(){
        console.log("try to set state to questionnary");
        this.setState({status: QUESTIONNARY});
        console.log("set state to questionnary");
    },
    render: function(){
        var content = <br></br>;
        var title = "Interactive Box";
        
        if(this.state.status == INDEX) {
            content = (<AdminView socket={this.socket} launchQuestionnary={this.launchQuestionnary}/>);
            title = "Interactive Box";
        } else if(this.state.status == WAIT) {
                console.log("state is wait");
            content = (<WaitPage socket={this.socket} launchQuizz={this.startQuestionnary}/>);
            title = this.state.questionnaryLaunched.title;
        } else if(this.state.status == QUESTIONNARY) {
                console.log("state is questionnary");
            content = (<Questionnary socket={this.socket} goToEnd={this.goToEnd} questionnary={this.state.questionnaryLaunched}/>);
            title = this.state.questionnaryLaunched.title;
        } else if(this.state.status == END){
            content = (<EndPage socket={this.socket} redirect={this.redirect}/>);
            title = this.state.questionnaryLaunched.title;           
        } else {
            content = (<p>Fatale erreur ! statut : {this.state.status}</p>);
            title = "Interactive Box";          
        }
        
        return(<div>
                   <h1 style={titleStyle} className="red centered">{title}</h1>
                   {content}
                </div>
        );        
    }
});

export default AdminHome;