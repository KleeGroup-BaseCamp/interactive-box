import React from 'react';
import Barchart from 'react-chartjs';

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
            console.log("ici c'est le did mount de question show");
            t.setState({time:data.time, questionLabel:data.question, answersLabels:data.answers, selectedAnswer:undefined, timeOut:false, showChart:false, chartData:firstChartData});
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
            t.setState({showChart:true});
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
                <CountdownTimer secondsRemaining = {this.state.time} timeOut={this.setTimeOut} key={this.state.answersLabels[0]}/> 
                <p> Question: {this.state.questionLabel} </p>
				<ul>{answersNodes}</ul>
                
			</div>
		);

    
    },
    
    _renderBarChart(){
        var socket = this.props.socket;
        
        console.log("je suis dans renderBarcHart");
			
            
        
        return(
            <Chart socket={socket} data={this.state.chartData} key={this.state.questionLabel} />
        );
    },
    
    render: function(){
        var content = this.state.showChart ?  this._renderBarChart() : this._renderQuizzPage();
        console.log("showChart est:" + this.state.showChart);
	    return(
	        <div>
	   			{content}
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
      console.log("did mount : state seconds remaining: " + this.state.secondsRemaining);
    this.interval = setInterval(this.tick, 1000);
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
  render: function() {
      //console.log("secondes restantes niveau Timer: " + this.state.secondsRemaining);
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
	render: function(){
	 	return(
            <div>
                <p>{this.props.label}</p>
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

        
        /*this.props.socket.on("chartData", function(newData){
            console.log("i received chartData");
            console.log(newData);
            t.setState({data:newData});

        });*/
	},
	render: function(){
		return <BarChart data = {this.state.data}/>;
	}
});



export default Answers;