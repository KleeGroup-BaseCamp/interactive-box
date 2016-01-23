import io from 'socket.io-client';
import React from 'react';
import $ from 'jquery';

import AdminQuestionnary from './Questionnary';
import QuestionnaryButtonsList from './QuestionnaryButtonsList'
import "./Admin.css"

var socket;

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
    return {data: [], quizzLaunched:undefined};
  },
  componentDidMount: function() {
    socket = io("http://localhost:8080/admin");
    this.loadQuestionnariesFromServer();
  },
  launchQuizz: function(questionnary){
    this.setState({quizzLaunched: questionnary});
  },
  render: function() {
      if(!this.state.quizzLaunched){
        return (
          <div className="middle-content">
            <h1 className="index-title-little">Quel questionnaire lancer ?</h1>
            <br></br>
            <QuestionnaryButtonsList data={this.state.data} launchQuizz={this.launchQuizz}/>
          </div>
        );
      } else {
        return (
          <div className="middle-content">
            <AdminQuestionnary questionnary={this.state.quizzLaunched} socket={socket}/>
          </div>
        );
      }
  }
});

export default AdminView;