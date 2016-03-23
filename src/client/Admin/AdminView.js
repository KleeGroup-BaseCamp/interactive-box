import io from 'socket.io-client';
import React from 'react';
import $ from 'jquery';

import ScrollableQuestionaryList from './ScrollableQuestionaryList'
import SimpleCounter from '../Utils/SimpleCounter'

import "./Admin.css"

var selectedPollKey;

var AdminView = React.createClass({
    loadQuestionnariesFromServer: function() {
        $.ajax({
            url: '/questionnaries',
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
        return {data: [], h:100};
    },
    componentDidMount: function() {
        this.loadQuestionnariesFromServer();
        var self = this;
        var node = this.refs.heightListener.getDOMNode(); // TODO pas bien d'utiliser cette fonction, enfin il parrait
        window.addEventListener("resize", function(e){ self.setState({h:node.offsetHeight}); });
        this.setState({h:node.offsetHeight});  
        this.props.socket.emit("ready-to-receive-users");
    },
    launchQuizz: function(questionnary){
        this.props.launchQuestionnary(questionnary);
    },
    render: function() {
        return (
            <div className="middle-content" ref="heightListener">
                <SimpleCounter 
                    socket={this.props.socket} 
                    addMessage="user-name"
                    removeMessage="remove-user-name"/>
                <h1 className="index-title-little">Choisissez un questionnaire à lancer ?</h1>
                <br></br>
                <ScrollableQuestionaryList data={this.state.data} launchQuizz={this.launchQuizz} height={this.state.h*5/10}/>
            </div>
        );
    }
});

export default AdminView;