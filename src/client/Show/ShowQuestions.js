import React from 'react';

import CountdownTimer from "../Utils/CountdownTimer";
import './ShowQuestionsStyle.css';

var BarChart = require("react-chartjs").Bar;
var answersLabels=[];

var Answers = React.createClass({
    //To DO: define initial arrays for chart

    getInitialState: function(){
        
        return {questionLabel: undefined, answersLabels:[], selectedAnswer:undefined, timeOut:false, time:30, showChart:false, qaCount:1, aCount:-1, chartData:
{
                    labels: ["Bla", "Bla", "Bla"],
                    datasets: [{label: 'Resultats', data: []}]
                }};
    },
    componentDidMount: function(){
        var t  = this;
        var socket = this.props.socket;
		socket.on("question-show", function(data){
            console.log("I received question-show");
            var numberOfAnswers = data.answers.length;
            var initResults = Array.apply(null, {length:numberOfAnswers}).map(function() {return 0;});
			var firstChartData = 
				{
					labels: data.answers,
					datasets: [{label: 'Resultats', data: initResults}]
				};
            t.setState({time:data.time, 
                        questionLabel:data.question, 
                        answersLabels:data.answers, 
                        selectedAnswer:undefined, 
                        timeOut:false, 
                        showChart:false, 
                        chartData:firstChartData});
            t.setState({qaCount: t.state.qaCount +  1});
            t.setState({aCount: -1});
            console.log("this is after i received a question");
            console.log("aCount: ");
            console.log(t.state.aCount)
            console.log("qaCount: ");
            console.log(t.state.qaCount);
        });
        socket.on("end-time", function(){
            t.setState({timeOut:true});
            if(t.state.selectedAnswer){
            } else {
            }
        });
        socket.on("showBarChart", function(){
            t.setState({showChart:!t.state.showChart});
        });
        
        socket.on("chartData", function(newData){
            console.log("i received chartData");
            //t.setState({qaCount: t.state.qaCount + 1});
            t.setState({aCount:t.state.aCount + 1})
            t.setState({chartData:newData});
            console.log('this is after I received charData');
            console.log("aCount: ");
            console.log(t.state.aCount);
            console.log("qaCount: ");
            console.log(t.state.qaCount);

        });
        
        t.setState({answersLabels:this.props.firsts.answers});
        t.setState({time:this.props.firsts.time});
        t.setState({questionLabel:this.props.firsts.question});
        //TO DO: try out firsts
    },
    setTimeOut: function(){
        this.setState({timeOut:true});  
    },
    
    _renderQuizzPage(){
        var indexOfAnswer = -1;
		var t = this;
        var answersNodes = this.state.answersLabels.map(function(label) {
        	return(<li><Answer label={label}/></li>);
        });
        var answersIds = answersLabels.length;
        var nombre = this.state.aCount/this.state.qaCount;
		return(
			<div height = '20%' className="middle-content">
                <h1 className="index-title">{this.state.questionLabel} </h1>
                <CountdownTimer className="index-title" duration = {this.state.time} timeOut={this.setTimeOut} key = {this.state.answersLabels[0]}/>
                <h2> {nombre} ont répondu !</h2>
				<ul>{answersNodes}</ul>
			</div>
		);

    
    },
    
    _renderBarChart(){
        var socket = this.props.socket;
        return(
            <div className="barchart">
            <Chart className="barchart" socket={socket} data={this.state.chartData} key={this.state.questionLabel}/>
            
            </div>
        );
    },
    
    render: function(){
        var content = this.state.showChart ?  this._renderBarChart() : this._renderQuizzPage();
	    return(
	        <div height = '70%'>
	   			{content}
	        </div>
	    );
  	}

});



var Answer = React.createClass({
	render: function(){
	 	return(
            <div>
                <p className="answer">{this.props.label}</p>
            </div>
        );
	}
});


var Chart = React.createClass({
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



export default Answers;