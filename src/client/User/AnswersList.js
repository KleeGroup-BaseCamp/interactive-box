import React from 'react';
import Result from './Result';
import AnswerButton from "./AnswerButton"
import CountdownTimer from "../Utils/CountdownTimer"
import "./AnswersList.css"

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
            time:"6",
            questionLabel:"truc"
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
            console.log('La Question recue');
            console.log(data);
            t.hasAlreadyAnswered = false;
            t.qCount++;
            t.setState({time:data.time, answers:t.createAnswersTable(data.answers), timeOut:false, questionLabel:data.question});
            console.log("this is the question");
            console.log(t.state.questionLabel);
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
        
        console.log(this.props.firsts.question);
        t.setState({answers:t.createAnswersTable(this.props.firsts.answers), time:this.props.firsts.time, questionLabel:this.props.firsts.question});
        console.log("this is the question2");
        console.log(t.state.questionLabel);
        this.qCount++;
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
            return (<li><AnswerButton action={chooseAnswer} key={label} answerText={label} mode={mode} nQuestions={t.state.answers.length}/></li>);
        });
    },
    getResult: function(){
        for(var j=0; j< this.state.answers.length;j++){
            var answer = this.state.answers[j];
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
                <h1 className = "big-title"> {this.state.questionLabel} </h1>
                <CountdownTimer duration = {time} timeOut={this.setTimeOut} key = {key}/>
				<ul>{answersButtonsArray}</ul>
                {result}
			</div>
		);
    }  
});

export default AnswersList;
            
            //<CountdownTimer secondsRemaining = {time} timeOut={this.setTimeOut} key={key}/> 