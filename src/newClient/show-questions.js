import React from 'react';
import Barchart from 'react-chartjs';

var BarChart = require("react-chartjs").Bar;
var answersLabels=[];

var Answers = React.createClass({
    
    getInitialState: function(){
        return {questionLabel: undefined, answersLabels:[], selectedAnswer:undefined, timeOut:false, time:30, showChart:false};
    },
    componentDidMount: function(){
        var t  = this;
        var socket = this.props.socket;
		socket.on("question-show", function(data){
            t.setState({time:data.time});
            t.setState({questionLabel:data.question})
            t.setState({answersLabels:data.answers});
            t.setState({selectedAnswer:undefined});
            t.setState({timeOut:false});
            console.log("ici");
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
        
        
        t.setState({answersLabels:this.props.firsts.answers});
        t.setState({time:this.props.firsts.time});
        t.setState({questionLabel:this.props.firsts.question});
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
    
    //TO DO RESOUDRE QUESTIONINDEX ET AUTRES INPUTS CHART
    _renderBarChart(){
        var socket = this.props.socket;
        var answersIds = answersLabels.length;
        var numberOfAnswers = answersIds.length;
			var initResults = this.zeroArray(numberOfAnswers);
			var chartData = 
				{
					labels: answersLabels,
					datasets: [{label: 'Resultats', data: initResults}]
				};
            //socket.emit("chartData", chartData);
        
        return(
            <Chart socket={socket} data={chartData} />
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
  	}, 
  	zeroArray: function(n){
		return Array.apply(null, {length: n}).map(function() {return 0;});
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
        
		/*this.props.socket.on("answer", function(indexOfAnswer){
            console.log("I received an answer");
			var newData = t.state.data;
	        newData.datasets[0].data[indexOfAnswer]++; 
	        t.setState({data: newData});
		});*/
        this.props.socket.on("chartData", function(newData){
           t.state.data = newData; 
            console.log("i received chartData");
            console.log(t.state.data);
        });
	},
	render: function(){
		return <BarChart data = {this.state.data}/>;
	}
});



export default Answers;