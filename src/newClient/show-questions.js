import React from 'react';

var Answers = React.createClass({
    getInitialState: function(){
        return {questionLabel: undefined, answersLabels:[], selectedAnswer:undefined, timeOut:false, time:"30"};
    },
    componentDidMount: function(){
        var t  = this;
		this.props.socket.on("question-show", function(data){
            t.setState({time:data.time});
            t.setState({questionLabel:data.question})
            t.setState({answersLabels:data.answers});
            t.setState({selectedAnswer:undefined});
            t.setState({timeOut:false});
            console.log("ici");
        });
        this.props.socket.on("end-time", function(){
            t.setState({timeOut:true});
            if(t.state.selectedAnswer){
                console.log("COUCOU");
            } else {
                console.log("kiki");
            }
        });
        
        t.setState({answersLabels:this.props.firsts.answers});
        t.setState({time:this.props.firsts.time});
        t.setState({questionLabel:this.props.firsts.question});
    },
    setTimeOut: function(){
        this.setState({timeOut:true});  
    },
    setTimeOut: function(){
        this.setState({timeOut:true});  
    },
    render: function(){
       	var indexOfAnswer = -1;
		var t = this;
        var answersNodes = this.state.answersLabels.map(function(label) {
        	return(<li><Answer label={label}/></li>);
        });
        console.log("time au niveau du json: " + this.state.time);
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
      console.log("secondes restantes niveau Timer: " + this.state.secondsRemaining);
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

export default Answers;