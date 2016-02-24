import React from 'react';
import Barchart from 'react-chartjs';
import CountdownTimer from "../Utils/CountdownTimer"

var BarChart = require("react-chartjs").Bar;
var answersLabels=[];

var Answers = React.createClass({
    //To DO: define initial arrays for chart
    getInitialState: function(){
        return {questionLabel: undefined, answersLabels:[], selectedAnswer:undefined, timeOut:false, time:30, showChart:false};
    },
   /* _zeroArray: function(n){
		return Array.apply(null, {length: n}).map(function() {return 0;});
	},*/
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
        });
        socket.on("end-time", function(){
            t.setState({timeOut:true});
            if(t.state.selectedAnswer){
                console.log("COUCOU");
            } else {
                console.log("kiki");
            }
        });
        socket.on("showBarChart", function(){
            t.setState({showChart:!t.state.showChart});
        });
        
        socket.on("chartData", function(newData){
            console.log("i received chartData");
            console.log(newData);
            t.setState({chartData:newData});

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
        //console.log("time au niveau du json: " + this.state.time);
        //La propriété key permet de relancer le compteur à chaque fois
        //C'est un peu sale, à voir si on peut pas faire une key correspondent à l'index de la question plutôt
        //TODO remplacer par un truc random
		return(
			<div className="middle-content">
                <h1 className="index-title">{this.state.questionLabel} </h1>
                <CountdownTimer className="index-title" duration = {this.state.time} timeOut={this.setTimeOut} key = {this.state.answersLabels[0]}/>
				<ul>{answersNodes}</ul>
			</div>
		);

    
    },
    
    _renderBarChart(){
        var socket = this.props.socket;
        return(
            <Chart socket={socket} data={this.state.chartData} key={this.state.questionLabel} />
        );
    },
    
    render: function(){
        var content = this.state.showChart ?  this._renderBarChart() : this._renderQuizzPage();
	    return(
	        <div>
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
            console.log("i received chartData");
            console.log(newData);
            t.setState({data:newData});

        });
	},
	render: function(){
		return <BarChart data = {this.state.data}/>;
	}
});



export default Answers;