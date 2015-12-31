import io from 'socket.io-client';
import React from 'react';
import $ from 'jquery';

import QuestionnaryDeveloped from './questionnary.jsx';

var socket;

var selectedPollKey;

var AdminBox = React.createClass({
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
  /*handleCommentSubmit: function(comment) {
        var comments = this.state.data;
    comment.id = Date.now();
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});

        $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },*/
  getInitialState: function() {
    return {data: [], quizzLaunched:undefined};
  },
  componentDidMount: function() {
    socket = io("http://localhost:8080/admin");
    this.loadQuestionnariesFromServer();
    //setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  launchQuizz: function(questionnary){
    this.setState({quizzLaunched: questionnary});
  },
  render: function() {
      if(!this.state.quizzLaunched){
        return (
          <div className="middle-content">
            <h1>Quel questionnaire lancer ?</h1>
            <br></br>
            <QuestsList data={this.state.data} launchQuizz={this.launchQuizz}/>
          </div>
        );
      } else {
        return (
          <div className="middle-content">
            <QuestionnaryDeveloped questionnary={this.state.quizzLaunched} socket={socket}/>
          </div>
        );
      }
  }
});

var QuestsList = React.createClass({

  render: function() {
    var questList = this;
    var questionnaryNodes = this.props.data.map(function(quest) {
      var launchQuest = function(){
        questList.props.launchQuizz(quest);
      }
      var count = quest.questions.length;
      return (
        <Questionnary title={quest.title} key={quest.id} author={quest.author} questionCount={count} id={quest.id} launchQuizz = {launchQuest}/>
      );
    });
    return (
      <div>
        {questionnaryNodes}
      </div>
    );
  }
});

var Questionnary = React.createClass({
  buttonAction: function(){
    this.props.launchQuizz();
  },
  render: function() {
    return (
      <div>
        <p><strong>{this.props.title}</strong> ({this.props.questionCount} questions)   -    {this.props.author}     <button onClick={this.buttonAction}>Lancer</button></p>
      </div>
    );
  }
});

// Ca, ca ne sert plus à rien vu que maintenant le composant est importé par un parent (src/client/index.js)

// ReactDOM.render(
//   <AdminBox url="/questionnaries"/>,
//   document.getElementById('content')
// );

// Par contre, comme il est importé, il faut bien spécifier quel composant le fichier expose

export default AdminBox;
