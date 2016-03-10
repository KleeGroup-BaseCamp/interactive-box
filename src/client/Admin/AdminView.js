import io from 'socket.io-client';
import React from 'react';
import $ from 'jquery';

import AdminQuestionnary from './Questionnary';
import QuestionnaryButtonsList from './QuestionnaryButtonsList'
import ScrollableQuestionaryList2 from './ScrollableQuestionaryList2'
import "./Admin.css"
var socket;

var selectedPollKey;

var AdminView = React.createClass({
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
    return {data: [{
        "title":"Présentation Klee Group",
        "id":1,
        "author":"Interactive Box Team",
        "questions":[
            {
                "qid":1,
                "text":"Quelle est la part de développement que vous envisagez pour votre stage?",
                "answers": ["1.1","1.2", "1.3" ],
                "time":12
                        },
            
             {
                "qid":2,
                "text":"Préférez-vous rencontrer des opérationnels ou des RH?",
                "answers":["2.1", "2.2", "2.3"],
                "time":15
                },   
            {
                "qid":3,
                "text": "Combien souhaiteraient postuler pour un stage de fin d'études?",
                "answers":["3.1", "3.2", "3.3"],
                "time":25
            }
            ],
        "answers":[ {
                            "rid":"1.1",
                            "label":"0%",
                            "correct":false
                        },
                        {
                            "rid":"1.2",
                            "label":"40-60%",
                            "correct":false
                        },
                        {
                            "rid":"1.3",
                            "label":"90-100%",
                            "correct":false
                        },
                        {
                            "rid":"2.1",
                            "label":"Opérationnels",
                            "correct":false
                        },
                        {
                            "rid":"2.2",
                            "label":"Les 2 en même temps",
                            "correct":false
                        },
                        {
                            "rid":"2.3",
                            "label":"RH",
                            "correct":false
                        },
                        {
                            "rid":"3.1",
                            "label":"Je veux postuler",
                            "correct":false
                        },
                        {
                            "rid":"3.2",
                            "label":"J'hésite à postuler",
                            "correct":false
                        },
                        {
                            "rid":"3.3",
                            "label":"Je ne suis pas intéressé(e)",
                            "correct":false
                        }]
    }], quizzLaunched:undefined, h:100};
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
          console.log(this.state.data);
        return (
          <div className="middle-content" ref="heightListener">
            <h1 className="index-title-little">Quel questionnaire lancer ?</h1>
            <br></br>
            <ScrollableQuestionaryList2 data={this.state.data} launchQuizz={this.launchQuizz} height={this.state.h*6/10}/>
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