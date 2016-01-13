import React from 'react';

const GOOD_ANSWER = "good";
const WRONG_ANSWER = "wrong";
const NO_ANSWER = "no";
const QUESTION = "question";

var Answers = React.createClass({
    getInitialState: function(){
        return {answersLabels:[], selectedAnswer:undefined, timeOut:false, answerState:QUESTION};
    },
    componentDidMount: function(){
        var t  = this;
		this.props.socket.on("question", function(answersLabels){
            t.setState({answersLabels:answersLabels});
            t.setState({selectedAnswer:undefined});
            t.setState({timeOut:false});
            t.setState({answerState:QUESTION});
        });
        this.props.socket.on("end-time", function(arrayOfGoodAnswers){
            t.setState({timeOut:true});
            if(arrayOfGoodAnswers){
                if(arrayOfGoodAnswers.length>0){
                    //S'il y a des bonnes réponses
                    if(!selectedAnswer){
                        t.setState({answerState:NO_ANSWER});
                    } else {
                        if (arrayOfGoodAnswers.indexOf(t.state.selectedAnswer) > -1) {
                            t.setState({answerState:GOOD_ANSWER});
                        } else {
                            t.setState({answerState:WRONG_ANSWER});
                        }
                    }
                }
            }
        });

        t.setState({answersLabels:this.props.firsts});
    },
    setTimeOut: function(){
        this.setState({timeOut:true});  
    },
    _renderQuestion: function(){
        var indexOfAnswer = -1;
		var t = this;
        var answersNodes = this.state.answersLabels.map(function(label) {
        	indexOfAnswer++;
        	var index = indexOfAnswer;
        	var chooseAnswer = function(){
        		t.props.socket.emit("answer", index);
                t.setState({selectedAnswer:index});
        	};
            var isBlocked = t.state.timeOut || !(t.state.selectedAnswer == undefined);
        	return(<li><Answer action={chooseAnswer} key={index} isClickable={!isBlocked} label={label}/></li>);
        });
        //La propriété key permet de relancer le compteur à chaque fois
        //C'est un peu sale, à voir si on peut pas faire une key correspondent à l'index de la question plutôt
        //TODO
		return(
			<div className="middle-content">
                <CountdownTimer secondsRemaining = "5" timeOut={this.setTimeOut} key={this.state.answersLabels[0]}/> 
				<ul>{answersNodes}</ul>
			</div>
		);
    },
    _renderWrong: function(){
        return (<p>WRONG !</p>);
    },
    _renderGood: function(){
        return (<p>Good !</p>);
    },
    _renderNo: function(){
        return (<p>It s      too late !</p>);
    },        
    render: function(){
        var a = this.state.answerState;
        if(a==QUESTION){
            return this._renderQuestion();
        } else if(a==WRONG_ANSWER){
            return this._renderWrong();
        } else if (a==GOOD_ANSWER){
            return this._renderGood();
        } else if(a==NO_ANSWER){
            return this._renderNo();
        } else {
            return (<p>ERROR</p>);
        }
   } 
});

var CountdownTimer = React.createClass({
  getInitialState: function() {
    return {
      secondsRemaining: 10
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
    this.interval = setInterval(this.tick, 1000);
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
  render: function() {
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
    action: function(){
      if(this.props.isClickable){
          this.props.action();
      }
    },
	render: function(){
        var isClickable = this.props.isClickable;
        var className = isClickable ? "answer-button" : "answer-button-blocked";
	 	return(
            <div>
                <button className={className} onClick = {this.action} key={this.props.index}>{this.props.label}</button>
            </div>
        );
	}
});

export default Answers;