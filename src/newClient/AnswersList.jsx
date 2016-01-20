import React from 'react';
import Result from './result';
import AnswerButton from "./AnswerButton.jsx"

//Modes des réponses
const CLICKABLE = "clickable";
const SELECTED = "selected";
const GOOD = "good";
const WRONG = "wrong";
const LOCKED = "locked";

const CORRECT = "correct";
const NOT_CORRECT = "not-correct";
const POLL = "poll";

// Etat du résultat
const RESULT_GOOD = "good";
const RESULT_WRONG = "wrong";
const RESULT_NO_ANSWER = "no";
const RESULT_NEUTRAL = "neutral";

var AnswersList = React.createClass({
    getInitialState: function(){
        return {
            answers:[], 
            timeOut:false,          
            time:"6"
        };
    },
    createAnswersTable: function(labels){
        return labels.map(function(label){
            return ({
                label: label,
                selected: false, 
                correct: POLL
            });
        });
    },
    determineMode: function(answer){
        var mode;
        if(this.state.timeOut){
            if(answer.correct==CORRECT){
                mode = GOOD;
            } else if (answer.correct == NOT_CORRECT){
                mode = WRONG;
            } else if (answer.correct==POLL){
                mode = POLL;
            }
        } else {
            if(this.hasAlreadyAnswered){
                mode = answer.selected ? SELECTED : LOCKED;
            } else {
                mode = CLICKABLE;
            }
        }
        return mode;
    },
    componentDidMount: function(){
        var t  = this;
        var socket = t.props.socket;
        
		socket.on("question", function(data){
            t.hasAlreadyAnswered = false;
            t.qCount++;
            t.setState({time:data.time, answers:t.createAnswersTable(data.answers), timeOut:false});
        });
        
        this.props.socket.on("end-time", function(arrayOfGoodAnswers){
            for(var i=0;i<t.state.answers.length;i++){
                if(arrayOfGoodAnswers.length>0){
                    t.state.answers[i].correct = (arrayOfGoodAnswers.indexOf(i)==-1) ? NOT_CORRECT : CORRECT;
                } else {
                    t.state.answers[i].correct = POLL;
                }
            }
            t.setState({timeOut:true});
        });
        
        t.setState({answers:t.createAnswersTable(this.props.firsts.answers), time:this.props.firsts.time});
    },
    qCount: -1,
    hasAlreadyAnswered: false,
    setTimeOut: function(){
        this.setState({timeOut:true});  
        this.props.socket.emit("end-time-request");
    },
    _renderAnswersButton: function(){
        var t  = this;
        var indexNew = -1;
        return this.state.answers.map(function(answer){
            indexNew++;
            var index = indexNew;
            var label = answer.label;
            var chooseAnswer = function(){
                t.props.socket.emit("answer", index);
                t.hasAlreadyAnswered = true;
                var answers = t.state.answers;
                answers[index].selected = true;
                t.setState({answers:answers});
            };
            var mode = t.determineMode(answer);
            return (<li><AnswerButton action={chooseAnswer} key={label} answerText={label} mode={mode}/></li>);
        });
    },
    getResult: function(){
        for(var j=0; j< this.state.answers.length;j++){
            var answer = this.state.answers[j];
            console.log(answer);
            console.log(this.state.answers);
            if(answer.selected && answer.correct == CORRECT){
                return RESULT_GOOD;
            } else if(answer.selected && answer.correct==NOT_CORRECT){
                return RESULT_WRONG;
            } else if(answer.correct == POLL){
                return RESULT_NEUTRAL;
            }
        }
        return RESULT_NO_ANSWER;
    },
    _renderResult: function(){
        if(this.state.timeOut){
            var resultMode = this.getResult();
            return (<Result answerState={resultMode}/>);
        } else {
            if(this.hasAlreadyAnswered){
                return (<p>On attend la fin du countdown ...</p>)
            } else{
                return (<p>Répondez !</p>);
            }
        }
    },
    render: function(){
        var answersButtonsArray = this._renderAnswersButton();
        var result = this._renderResult();
        var key = this.qCount;
        var time = this.state.timeOut ? "0" : this.state.time;
		return(
			<div className="middle-content">
                <CountdownTimer secondsRemaining = {time} timeOut={this.setTimeOut} key={key}/> 
				<ul className="answers-buttons-array">{answersButtonsArray}</ul>
                {result}
			</div>
		);
    }  
});

var CountdownTimer = React.createClass({
  getInitialState: function() {
    return {
      secondsRemaining: 20
    };
  },
  tick: function() {
    this.setState({secondsRemaining: this.state.secondsRemaining - 1});
    if (this.state.secondsRemaining <= 0) {
      clearInterval(this.interval);
      this.props.timeOut();
    }
  },
  componentDidMount: function() {
    this.setState({ secondsRemaining: this.props.secondsRemaining });
    this.interval = setInterval(this.tick, 1000);
  },
    componentWillReceiveProps: function(nextProps){
        this.setState({secondsRemaining:nextProps.secondsRemaining});
    },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
  render: function() {
      if (this.state.secondsRemaining > 0){
        return (
        <div className="timer">Seconds Remaining: {this.state.secondsRemaining}</div>
        );
      }
      else {
          return (<p className="timer">Temps écoulé</p>);
      }
  }
});

export default AnswersList;