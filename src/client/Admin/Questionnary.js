import React from 'react';

import Barchart from 'react-chartjs';
import RaisedButton from 'material-ui/lib/raised-button';
import AdminAnswers from './AdminAnswers';

var questionnaryUtils = require("../Utils/QuestionnaryUtils.js");

var BarChart = require("react-chartjs").Bar;

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

var AdminQuestionnary = React.createClass({
	getInitialState: function(){
		return {questionIndex:0, showBarChart:false}
	},
	componentDidMount: function(){
		var self = this;
        this.props.socket.on("end-time", function(){
            var arrayOfGoodAnswers = questionnaryUtils.arrayOfGoodAnswers(self.props.questionnary, self.state.questionIndex);
            self.props.socket.emit("good-answers", arrayOfGoodAnswers);  
        });
	},
	incrementCounter: function(){
		var oldQuestionIndex = this.state.questionIndex;
		this.setState({questionIndex:oldQuestionIndex+1, showBarChart:false});
	},
    showBarChart: function(){
        this.props.socket.emit("showBarChart");
        this.setState({showBarChart:!this.state.showBarChart});
    },
    zeroArray: function(n){
		return Array.apply(null, {length: n}).map(function() {return 0;});
	},
	render(){
		var questionnary = this.props.questionnary;
		var maxIndex = questionnary.questions.length;
		if(this.state.questionIndex<maxIndex){
			var question = questionnary.questions[this.state.questionIndex];
			var questionTitle = question.text;
	        var answersLabels = [];
			var answersIds = question.answers;
			var answersObjects = questionnary.answers;
            var answersLabelsCorrect = [];
	        for(var i=0;i<answersIds.length;i++){
	        	for (var j = 0; j<answersObjects.length; j++){
	                if (answersObjects[j].rid == answersIds[i]){
                        answersLabels.push(answersObjects[j].label);
	                    answersLabelsCorrect.push({label: answersObjects[j].label, correct: answersObjects[j].correct});
	                }
	            }
	        }
            var time = question.time || 10;
            var data = {answers:answersLabels, time:time, question: questionTitle};
            var datashow = {answers:answersLabels, time:time, question: questionTitle};
	        this.props.socket.emit("question", data);
            this.props.socket.emit("question-show", datashow);

		    var numberOfAnswers = answersIds.length;
			var initResults = this.zeroArray(numberOfAnswers);
            var rand = colors[Math.floor(Math.random() * colors.length)];
			var chartData = 
				{
					labels: answersLabels,
					datasets: [{label: 'Resultats', data: initResults, fillColor: rand}]
				};
            this.props.socket.emit("chartData", chartData);
            var buttonStyle = {
                width:"60%",
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
                width: '50%',
                marginTop:'10%'};
            var buttonStyle2 = {width:"100%", display:"block", padding:'0px'};
            var centerStyle = {textAlign:'center'};
            var divStyle = {width:"100%", display:"block", padding:'0px', marginTop:"3%"};
			return (
				<div className='middle-content'>
					<p className="centered little padding6">{questionTitle}</p>
                    <AdminAnswers answersLabelsCorrect={answersLabelsCorrect}/>
                    <table style={divStyle}>
                        <tr>
                            <td style={centerStyle}>
                                <RaisedButton
                                    label="Question suivante"
                                    buttonStyle={buttonStyle2}
                                    onMouseDown={this.incrementCounter}
                                    labelStyle={labelStyle}
                                />
                            </td>
                            <td style={centerStyle}>
                                <RaisedButton
                                    label={this.state.showBarChart ? "Cacher les réponses" : "Afficher les réponses"}
                                    buttonStyle={buttonStyle2}
                                    onMouseDown={this.showBarChart}
                                    labelStyle={labelStyle}
                                />
                            </td>
                        </tr>   
                    </table>
					<Chart
                        socket={this.props.socket}
                        data={chartData}
                        key={this.state.questionIndex}
                    />
				</div>
			);
		} else {
            this.props.goToEnd();
		}
	}
});

var Chart = React.createClass({
	getInitialState: function(){
		var t = this;
		return({data:t.props.data});
	}, 
	componentDidMount: function(){
		var socket = this.props.socket;
		var t = this;
        for (var i = 0; i<this.props.data.labels.length;i++) {
            var newData = this.props.data;
            var label = this.props.data.labels[i];
            var TruncatedLabel = label.substring(0,10);
            newData.labels[i]=TruncatedLabel;
            this.setState({data: newData});
    // d'autres instructions
}
            
		socket.on("answer", function(indexOfAnswer){
			var newData = t.state.data;
	        newData.datasets[0].data[indexOfAnswer]++; 
	        t.setState({data: newData});
            socket.emit("chartData", t.state.data);
		});
	},
	render: function(){
        var centerChartStyle = {marginLeft:'auto', marginRight:'auto', display:'block', width:'80%', height:'40%', marginTop:'3%'};
		return <BarChart data = {this.state.data}
                                style={centerChartStyle}
                        className="coucoucouc"/>;
	}
});

export default AdminQuestionnary;