import io from 'socket.io-client';
import React from 'react';
import $ from 'jquery';

import AdminQuestionnary from './Questionnary';
import QuestionnaryButtonsList from './QuestionnaryButtonsList'
import ScrollableQuestionaryList2 from './ScrollableQuestionaryList2'
import "./Admin.css"
import SimpleCounter from '../Utils/SimpleCounter'

var selectedPollKey;

var AdminView = React.createClass({
    socket: undefined,
    loadQuestionnariesFromServer: function() {
        console.log("je suis dans loadQuestionnaries");
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function() {
        return {data: [], quizzLaunched:undefined, h:100};
    },
    componentWillMount: function(){
        this.socket = io("/admin");
    },
    componentDidMount: function() {
        this.loadQuestionnariesFromServer();
        var t = this;
        var node = this.refs.heightListener.getDOMNode(); // TODO pas bien d'utiliser cette fonction, enfin il parrait
        window.addEventListener("resize", function(e){ t.setState({h:node.offsetHeight}); });
        t.setState({h:node.offsetHeight});  
        this.socket.emit("ready-to-receive-users");
    },
    launchQuizz: function(questionnary){
        this.setState({quizzLaunched: questionnary});
    },
    render: function() {
        if(!this.state.quizzLaunched){
            console.log(this.state.data);
            return (
                <div className="middle-content" ref="heightListener">
                    <SimpleCounter 
                        socket={this.socket} 
                        addMessage="user-name"
                        removeMessage="remove-user-name"/>
                    <h1 className="index-title-little">Choisissez un questionnaire à lancer ?</h1>
                    <br></br>
                    <ScrollableQuestionaryList2 data={this.state.data} launchQuizz={this.launchQuizz} height={this.state.h*5/10}/>
                </div>
            );
        } else {
            return (
                <div className="middle-content">
                    <AdminQuestionnary questionnary={this.state.quizzLaunched} socket={this.socket}/>
                </div>
            );
        }
    }
});

export default AdminView;