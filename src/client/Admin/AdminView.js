import io from 'socket.io-client';
import React from 'react';
import $ from 'jquery';

import AdminQuestionnary from './Questionnary';
import QuestionnaryButtonsList from './QuestionnaryButtonsList'
import ScrollableQuestionaryList from './ScrollableQuestionaryList'
import "./Admin.css"
import SimpleCounter from '../Utils/SimpleCounter'

var selectedPollKey;

var AdminView = React.createClass({
  loadQuestionnariesFromServer: function() {
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
  componentDidMount: function() {
    this.socket = io("http://localhost:8080/admin");
    this.loadQuestionnariesFromServer();
    var t = this;
    var node = this.refs.heightListener.getDOMNode(); // TODO pas bien d'utiliser cette fonction
    window.addEventListener("resize", function(e){
        t.setState({h:node.offsetHeight});  
    });
    t.setState({h:node.offsetHeight});  
    this.socket.emit("ready-to-receive-user-count");
  },
  launchQuizz: function(questionnary){
    this.setState({quizzLaunched: questionnary});
  },
  render: function() {
      if(!this.socket){
          this.socket = io("http://localhost:8080/admin");
      }
      if(!this.state.quizzLaunched){
        return (
          <div className="middle-content" ref="heightListener">
            <SimpleCounter 
                socket={this.socket} 
                addMessage="add-user-name"
                removeMessage="remove-user-name"
                fixCountMessage="fix-count"/>
            <h1 className="index-title-little">Quel questionnaire lancer ?</h1>
            <br></br>
            <ScrollableQuestionaryList data={this.state.data} launchQuizz={this.launchQuizz} height={this.state.h*6/10}/>
          </div>
        );
      } else {
        return (
          <div className="middle-content">
            <AdminQuestionnary questionnary={this.state.quizzLaunched} socket={this.socket}/>
          </div>
        );
      }
  }, 
    socket: undefined
});

export default AdminView;