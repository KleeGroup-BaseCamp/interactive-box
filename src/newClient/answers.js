import React from 'react';
import Result from '../newClient/result';

//Modes d'affichage du tableau des réponses
const GOOD_ANSWER = "good";
const WRONG_ANSWER = "wrong";
const NO_ANSWER = "no";
const NEUTRAL = "neutral";
const QUESTION = "question";

//Modes des réponses
const CLICKABLE = "clickable";
const SELECTED = "selected";
const GOOD = "good";
const WRONG = "wrong";
const LOCKED = "locked";

var Answers = React.createClass({
    
    getInitialState: function(){
        return {
            answersLabels:[],
            selectedAnswer:undefined,       
            timeOut:false,                 
            answerState:QUESTION,           
            time:"30",
            arrayOfGoodAnswers:[]
        };
    },
    updateAnswerButtons: function(answerLabels){
        var indexNew = -1;
        t.answerButtons = data.answers.map(function(label){
            indexNew++;
            var index = indexNew;
            var chooseAnswer = function(){
                t.props.socket.emit("answer", index);
                t.setState({selectedAnswer:index});
            }
            var mode;
            if(t.state.answerState==QUESTION){
                if(t.state.selectedAnswer==undefined){
                    mode = CLICKABLE;
                } else {
                    mode = t.state.selectedAnswer==index ? SELECTED : LOCKED;
                }
            } else {
                
            }
            return (<li><AnswerButton action={chooseAnswer} key={index} answerText={label} mode={undefined}/></li>);
        });
    },
    componentDidMount: function(){
        var t  = this;
		this.props.socket.on("question", function(data){
            t.setState({time:data.time});
            t.setState({answersLabels:data.answers});
            t.setState({selectedAnswer:undefined});
            t.setState({timeOut:false});
            t.setState({answerState:QUESTION});
        });
        
        this.props.socket.on("end-time", function(arrayOfGoodAnswers){
            t.setState({timeOut:true});
            console.log(arrayOfGoodAnswers);
            if(arrayOfGoodAnswers){
                if(arrayOfGoodAnswers.length>0){
                    //S'il y a des bonnes réponses
                    if(t.state.selectedAnswer==undefined){
                        t.setState({answerState:NO_ANSWER});
                    } else {
                        if (arrayOfGoodAnswers.indexOf(t.state.selectedAnswer) > -1) {
                            t.setState({answerState:GOOD_ANSWER});
                        } else {
                            t.setState({answerState:WRONG_ANSWER});
                        }
                    }
                } else {
                    if(t.state.selectedAnswer==undefined){
                        t.setState({answerState:NO_ANSWER});
                    } else {
                        t.setState({answerState:NEUTRAL});
                    }
                }
            }
        });
        
        t.setState({answersLabels:this.props.firsts.answers});
        t.setState({time:this.props.firsts.time});
        updateAnswerButtons(this.props.firsts.answers);
    },
    setTimeOut: function(){
        this.setState({timeOut:true});  
        this.props.socket.emit("end-time-request");
    },
    answerButtons: [],
    render: function(){
        
        updateAnswerButtons(this.props.firsts.answers);
        
        var result = this._renderResult();
        var key = new Date().valueOf();
        
		return(
			<div className="middle-content">
                <CountdownTimer secondsRemaining = {this.state.time} timeOut={this.setTimeOut} key={key}/> 
				<ul>{answersNodes}</ul>
                <ul>{answerNodesNew}</ul>
                {result}
			</div>
		);
    },     
    _renderResult: function(){
        var a = this.state.answerState;
        if(a==QUESTION){
            return(<p>"Répond maintenant !"</p>);
        } else {
            return (<Result answerState={a}/>);
        }
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
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
  render: function() {
      if (this.state.secondsRemaining > 0){
        return (
        <div>Seconds Remaining: {this.state.secondsRemaining}</div>
        );
      }
      else {
          return (<p>Temps écoulé</p>);
      }
  }
});


var Answer = React.createClass({
    action: function(){
      if(this.props.isClickable){
          this.props.action();
      }
    },
	render: function(){
        var isClickable = this.props.isClickable;
        var className = isClickable ? "answer-button" : "answer-button-blocked";
	 	return(
            <div>
                <button className={className} onClick = {this.action} key={this.props.index}>{this.props.label}</button>
            </div>
        );
	}
});

export default Answers;