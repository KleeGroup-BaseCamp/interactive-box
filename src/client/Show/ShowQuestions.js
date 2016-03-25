import React from 'react';

import CountdownTimer from "../Utils/CountdownTimer";
import Chart from "../Utils/Chart";
import AnswerButton from '../User/AnswerButton';
import CircularProgress from 'material-ui/lib/circular-progress';

var questionnaryUtils = require("../Utils/QuestionnaryUtils.js");

import './ShowQuestionsStyle.css';


const titleStyle = {
    paddingTop:'3%',
    fontSize:'5vmin', 
};

const buttonLabelStyle = {
    fontSize:'5vmin'
};

const labelStyle = {
    textTransform: 'none',
    fontSize: '150%',
    textAlign: 'centered'
};

const questionTitleStyle = {
    textAlign:'center', 
    color:'#8BC34A', 
    fontSize:'5vmin',
    marginTop:'3%'
};

//Modes des réponses
const CLICKABLE = "clickable";
const GOOD = "good";
const WRONG = "wrong";
const CORRECT = "correct";
const NOT_CORRECT = "not-correct";
const POLL = "poll";

const circularProgressStyle = {
    display:'block',
    marginTop:'20%', 
    maringBottom:'20%', 
    marginLeft:'auto', 
    marginRight:'auto'
};

const centeredStyle = {
    textAlign: 'center'
};

var ShowQuestions = React.createClass({
    getInitialState: function(){
        return {
            waiting:true,
            questionLabel:"le truc",
            answers:[],
            timeOut:false,
            time:"6", 
            answerCount:0
        };
    },
    createAnswersTable: function(labels){
        return labels.map(function(label){
            return ({
                label: label,
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
                mode = CLICKABLE;
            }
        } else {
            mode = CLICKABLE;
        }
        return mode;
    },
    componentDidMount: function(){
        var self  = this;
        
		this.props.socket.on("question", function(data){
            var numberOfAnswers = data.answers.length;
            var initResults = Array.apply(null, {length:numberOfAnswers}).map(function() {return 0;});

            console.log("resetting ", data.question, self.state.questionLabel)
            if(data.question != self.state.questionLabel){
                console.log("yes i reset");
                self.setState({answerCount:0});
            }
            self.setState({
                time:data.time,
                answers:self.createAnswersTable(data.answers),
                timeOut:false,
                questionLabel:data.question,
                waiting:false
            });
            
        });
        
        this.props.socket.on('answer', function(){
            self.setState({answerCount: self.state.answerCount +1 }); 
        });
        
        this.props.socket.on("good-answers", function(arrayOfGoodAnswers){
            for(var i=0;i<self.state.answers.length;i++){
                if(arrayOfGoodAnswers.length>0){
                    self.state.answers[i].correct = (arrayOfGoodAnswers.indexOf(i)==-1) ? NOT_CORRECT : CORRECT;
                } else {
                    self.state.answers[i].correct = POLL;
                }
            }
            self.setState({timeOut:true});
        });

        this.props.socket.emit('ready-to-start-quizz');
    },
    setTimeOut: function(){ // demande des réponses à la fin du temps TODO a régler
        this.setState({timeOut:true}); 
    },
    _renderAnswersButton: function(){
        var self  = this;
        var indexNew = -1;
        return this.state.answers.map(function(answer){
            indexNew++;
            var index = indexNew;
            var label = answer.label;
            var mode = self.determineMode(answer);
            return (<li>
                        <AnswerButton
                            height={30}
                            fontSize='150%'
                            key={label}
                            answerText={label}
                            mode={mode}
                            nQuestions={self.state.answers.length}/>
                    </li>
                );
        });
    },
    _renderWaitPage(){
        return(
                <CircularProgress style={circularProgressStyle}/>
              );  
    },
    _generateLabel(){
        if(this.state.answerCount == 0){
            return "Aucune réponse reçue";
        } else if(this.state.answerCount == 1){
            return "Une réponse reçue";
        } else {
            return this.state.answerCount + " réponses reçues";
        }
    },
    render: function(){
        var answersButtonsArray = this._renderAnswersButton();
        var key = this.state.questionLabel;
        var time = this.state.timeOut ? "0" : this.state.time;
        var answersLabels = this.state.answers.map(function(labelCorrect){return labelCorrect.label;});
        if(this.state.waiting){
            return this._renderWaitPage();
        } else {  
            return(
                <div className="middle-content">
                    <h1 style={questionTitleStyle}> {this.state.questionLabel} </h1>
                    <CountdownTimer duration = {time} timeOut={this.setTimeOut} key = {key}/>
                    <ul>{answersButtonsArray}</ul>
                    <h2 style={centeredStyle}>{this._generateLabel()}</h2>
                    <Chart
                        socket={this.props.socket}
                        labels={answersLabels}
                        key={this.state.questionLabel + "#key"}
                        questionID={this.state.questionLabel}
                    />
                </div>
            );
        }
    }
});


export default ShowQuestions;