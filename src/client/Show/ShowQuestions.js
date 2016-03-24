import React from 'react';

import CountdownTimer from "../Utils/CountdownTimer";
import AnswerButton from '../User/AnswerButton';
import CircularProgress from 'material-ui/lib/circular-progress';

var BarChart = require("react-chartjs").Bar;
var questionnaryUtils = require("../Utils/QuestionnaryUtils.js");

import './ShowQuestionsStyle.css';

var colors = ['#607D8B', '#FF5722', '#795548', '#FF9800', '#FFC107', '#FFEB3B', '#CDDC39', '#8BC34A', '#4CAF50', '#009688', '#00BCD4', '#00BCD4', '#3F51B5', '#673AB7', '#9C27B0', '#E91E63', '#F44336']; 

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

var ShowQuestions = React.createClass({
    getInitialState: function(){
        return {
            waiting:true,
            questionLabel:"le truc",
            answers:[],
            timeOut:false,
            time:"6", 
            showChart:false,
            answerCount:0,
            qaCount:1,
            aCount:-1,
            chartData:{
                labels: ["Bla", "Bla", "Bla"],
                datasets: [{label: 'Resultats', data: []}]
            }
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
                mode = POLL;
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
			var firstChartData = {
                labels: data.answers,
                datasets: [{label: 'Resultats', data: initResults}]
            };
            self.setState({
                time:data.time,
                answers:self.createAnswersTable(data.answers),
                timeOut:false,
                questionLabel:data.question,
                waiting:false, 
                showChart:false, 
                chartData:firstChartData, 
                qaCount: self.state.qaCount+1, 
                aCount: 0, 
                answerCount:0
            });
        });

        this.props.socket.on("showBarChart", function(){
            self.setState({showChart:!self.state.showChart});
        });
        
        this.props.socket.on('answer', function(){
            self.setState({answerCount: self.state.answerCount +1 }); 
        });
        
        this.props.socket.on("end-time", function(arrayOfGoodAnswers){
            for(var i=0;i<self.state.answers.length;i++){
                if(arrayOfGoodAnswers.length>0){
                    self.state.answers[i].correct = (arrayOfGoodAnswers.indexOf(i)==-1) ? NOT_CORRECT : CORRECT;
                } else {
                    self.state.answers[i].correct = POLL;
                }
            }
            self.setState({timeOut:true});
        });
        
        this.props.socket.on("chartData", function(newData){
            self.setState({aCount:self.state.aCount + 1})
            self.setState({chartData:newData});
        });

        this.props.socket.emit('ready-to-start-quizz');
    },
    setTimeOut: function(){ // demande des réponses à la fin du temps TODO a régler
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
            var mode = self.determineMode(answer);
            return (<li>
                        <AnswerButton
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
    _renderAnswers: function(){
        var answersButtonsArray = this._renderAnswersButton();
        var key = this.state.questionLabel;
        var time = this.state.timeOut ? "0" : this.state.time;
        if(this.state.waiting){
            return this._renderWaitPage();
        } else {  
            return(
                <div className="middle-content">
                    <h1 className = "big-title"> {this.state.questionLabel} </h1>
                    <CountdownTimer duration = {time} timeOut={this.setTimeOut} key = {key}/>
                    <ul>{answersButtonsArray}</ul>
                    <h2>{this.state.answerCount} ont répondu !</h2>
                </div>
            );
        }
    }, 
    render: function(){
        if(this.state.showChart){
            return (
                <div>
                   {this._renderAnswers()}
                    <Chart
                        socket={this.props.socket}
                        data={this.state.chartData}
                        key={this.state.questionIndex}
                    />
                </div>
           );
        } else {
            return this._renderAnswers();
        }
    }
});


var Chart = React.createClass({
	getInitialState: function(){
		return({data:this.props.data});
	}, 
	componentDidMount: function(){
		var socket = this.props.socket;
		var self = this;
        for (var i = 0; i<this.props.data.labels.length;i++) {
            var newData = this.props.data;
            var label = this.props.data.labels[i];
            var TruncatedLabel = label.substring(0,10);
            newData.labels[i]=TruncatedLabel;
            this.setState({data: newData});
    // d'autres instructions
}
            
		socket.on("answer", function(indexOfAnswer){
			var newData = self.state.data;
	        newData.datasets[0].data[indexOfAnswer]++; 
	        self.setState({data: newData});
            socket.emit("chartData", t.state.data);
		});
	},
	render: function(){
        var centerChartStyle = {
            marginLeft:'auto', 
            marginRight:'auto', 
            display:'block', 
            width:'80%', 
            height:'40%', 
            marginTop:'3%'
        };
		return <BarChart 
            data = {this.state.data}
            style={centerChartStyle}
            className="chart-class"
        />;
	}
});


var ChartOld = React.createClass({
	getInitialState: function(){
		var t = this;
		return({data:t.props.data});
	}, 
	componentDidMount: function(){
        
		var t = this;
        console.log("Chart did mount");
        console.log(t.state.data);
        this.props.socket.on("chartData", function(newData){
            t.setState({data:newData});

        });
	},
	render: function(){
		return (<div>
                <BarChart data = {this.state.data}/>
               </div>
               );
	}
});



export default ShowQuestions;