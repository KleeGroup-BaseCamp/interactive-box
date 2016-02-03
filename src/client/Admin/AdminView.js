import io from 'socket.io-client';
import React from 'react';
import $ from 'jquery';

import AdminQuestionnary from './Questionnary';
import QuestionnaryButtonsList from './QuestionnaryButtonsList'
import ScrollableQuestionaryList from './ScrollableQuestionaryList'
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
    return {data: [], quizzLaunched:undefined, h:100};
  },
  componentDidMount: function() {
    socket = io("http://localhost:8080/admin");
    this.loadQuestionnariesFromServer();
    var t = this;
    var node = this.refs.heightListener.getDOMNode(); // TODO pas bien d'utiliser cette fonction
    window.addEventListener("resize", function(e){
        t.setState({h:node.offsetHeight});  
    });
    t.setState({h:node.offsetHeight});  
  },
  launchQuizz: function(questionnary){
    this.setState({quizzLaunched: questionnary});
  },
  render: function() {
      if(!this.state.quizzLaunched){
        return (
          <div className="middle-content" ref="heightListener">
            <h1 className="index-title-little">Quel questionnaire lancer ?</h1>
            <br></br>
            <ScrollableQuestionaryList data={this.state.data} launchQuizz={this.launchQuizz} height={this.state.h*6/10}/>
          </div>
        );
      } else {
        return (
          <div className="middle-content">
            <AdminQuestionnary questionnary={this.state.quizzLaunched} socket={socket}/>
          </div>
        );
      }
  }, 
    
    
    _rowRenderer (index) {
   // const { list } = this.props
    const { useDynamicRowHeight } = this.state

    const datum = list[index];

    return (
      <div style={{ height: '100%' }}>
        <span>
          <span >
            {datum}
          </span>
          <span>
            This is row {index}
          </span>
        </span>
      </div>
    )
  }
});

export default AdminView;