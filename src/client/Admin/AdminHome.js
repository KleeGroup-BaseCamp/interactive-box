import io from 'socket.io-client';
import React from 'react';
import RaisedButton from 'material-ui/lib/raised-button';

import AdminView from './AdminView';
import WaitPage from './WaitPage';
import AdminQuestionnary from './Questionnary';
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
    backward: function(){
        this.setState({status: INDEX, questionnaryLaunched:undefined});
        this.socket.emit("abort-quizz");
    },
    goToEnd: function(){
        this.setState({status:END});
        this.socket.emit('end-questionnary');
    },
    launchQuestionnary: function(questionnary){
        this.setState({status: WAIT, questionnaryLaunched: questionnary});
        this.socket.emit("launch-quizz", questionnary.qid);
    },
    startQuestionnary: function(){
        this.setState({status: QUESTIONNARY});
    },
    renderTitle: function(){
        if(this.state.status == INDEX) {
            return "Interactive Box";
        } else if(this.state.status == WAIT) {
            return this.state.questionnaryLaunched.title;
        } else if(this.state.status == QUESTIONNARY) {
            return this.state.questionnaryLaunched.title;
        } else if(this.state.status == END){
            return this.state.questionnaryLaunched.title;           
        } else {
            return "Interactive Box";          
        }
    },
    renderContent: function(){
        var self = this;
        if(this.state.status == INDEX) {
            
            return(<AdminView 
               socket={this.socket} 
               launchQuestionnary={this.launchQuestionnary}/>);
                   
        } else if(this.state.status == WAIT) {
                
            return(<WaitPage 
                socket={self.socket}
                   key="1"
                launchQuizz={this.startQuestionnary} backward={this.backward}/>);
                   
        } else if(this.state.status == QUESTIONNARY) {
                
            return(<AdminQuestionnary
                socket={this.socket}
                goToEnd={this.goToEnd}
                questionnary={this.state.questionnaryLaunched}/>);
                   
        } else if(this.state.status == END){
            return(<EndPage
                   socket={this.socket}
                   redirect={this.redirect}/>);          
        } else {
            return(<p>
                   Fatale erreur ! statut : {this.state.status}
                   </p>
                  );
        }
    },
        
     buttonStyle2: {
        display: 'block',
        marginTop:'5%',
        marginLeft:'auto',
        marginRight:'auto',
        width: '15%',
        height: '3%',
        textAlign: 'centered',
        
    },
    labelStyle: {
        textTransform: 'none',
        fontSize: '60%',
        lineHeight: '150%',
        color: '#727272',
        fontWeight:'bold'
    },
        
    render: function(){
        var returnButton = <RaisedButton 
        label="Retour au choix des questionnaires" 
        onMouseDown={this.backward} 
        style={this.buttonStyle2}
        labelStyle={this.labelStyle}/>
        return(<div>
                   <h1 style={titleStyle} className="red centered">{this.renderTitle()}</h1>
                   {this.renderContent()}
                    {returnButton}
                </div>
        );   
    }
});

export default AdminHome;