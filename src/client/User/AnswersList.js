import React from 'react';

import Result from './Result';
import AnswerButton from "./AnswerButton"
import CountdownTimer from "../Utils/CountdownTimer"
import CircularProgress from 'material-ui/lib/circular-progress';

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

const circularProgressStyle = {
    display:'block',
    marginTop:'20%', 
    maringBottom:'20%', 
    marginLeft:'auto', 
    marginRight:'auto'
};

const questionTitleStyle = {
    textAlign:'center', 
    color:'seagreen', 
    fontSize:'5vmin',
    marginTop:'3%'
};

const pStyle = {
    textAlign:'center'
};

var AnswersList = React.createClass({
    getInitialState: function(){
        return {
            waiting:true,
            questionLabel:"le truc",
            answers:[],
            timeOut:false,
            time:"6", 
            answered:false
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
            if(this.state.answered){
                mode = answer.selected ? SELECTED : LOCKED;
            } else {
                mode = CLICKABLE;
            }
        }
        return mode;
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
    componentDidMount: function(){
        var self  = this;
        
		this.props.socket.on("question", function(data){
            self.setState({
                time:data.time,
                answers:self.createAnswersTable(data.answers),
                timeOut:false,
                questionLabel:data.question,
                answered:false, 
                waiting:false
            });
        });
        
        this.props.socket.on("good-answers", function(arrayOfGoodAnswers){
            for(var i=0;i<self.state.answers.length;i++){
                if(arrayOfGoodAnswers.length>0){
                    self.state.answers[i].correct = (arrayOfGoodAnswers.indexOf(i)==-1) ? NOT_CORRECT : CORRECT;
                } else {
                    self.state.answers[i].correct = POLL;
                }
            }
            //TODO a priori on peut effacer cette ligne, à voir
            self.setState({timeOut:true});
        });
        
        this.props.socket.emit('ready-to-start-quizz');
    },
    setTimeOut: function(){ // demande des réponses à la fin du temps
        this.setState({timeOut:true}); 
        this.props.socket.emit("end-time-request");
    },
    _renderAnswersButton: function(){
        var self  = this;
        var indexNew = -1;
        return this.state.answers.map(function(answer){
            indexNew++;
            var index = indexNew;
            var label = answer.label;
            var chooseAnswer = function(){
                self.props.socket.emit("answer", index);
                var answers = self.state.answers;
                answers[index].selected = true;
                self.setState({answers:answers, answered:true});
            };
            var mode = self.determineMode(answer);
            return (<li>
                        <AnswerButton
                            height={50}
                            fontSize='200%'
                            action={chooseAnswer}
                            key={label}
                            answerText={label}
                            mode={mode}
                            nQuestions={self.state.answers.length}/>
                    </li>
                );
        });
    },

    _renderResult: function(){
        if(this.state.timeOut){
            var resultMode = this.getResult();
            return (<Result answerState={resultMode}/>);
        } else {
            if(this.state.answered){
                return (<p style={pStyle}>
                            Réponse enregistrée
                        </p>
                    );
            } else{
                return (<p style={pStyle}>
                            A vous de répondre !
                        </p>
                );
            }
        }
    },
    
    _renderWaitPage(){
        return(<CircularProgress style={circularProgressStyle}/>);  
    },
    
    render: function(){
        var answersButtonsArray = this._renderAnswersButton();
        var result = this._renderResult();
        var key = this.state.questionLabel;
        var time = this.state.timeOut ? "0" : this.state.time;
        if(this.state.waiting){
            return this._renderWaitPage();
        } else {  
            return(
                <div className="middle-content">
                    <h1 style={questionTitleStyle}> {this.state.questionLabel} </h1>
                    <CountdownTimer duration = {time} timeOut={this.setTimeOut} key = {key}/>
                    <ul>{answersButtonsArray}</ul>
                    {result}
                </div>
            );
        }
    }  
});

export default AnswersList;