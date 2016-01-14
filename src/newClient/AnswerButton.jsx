import React from 'react';

//Modes d'affichage du bouton
const CLICKABLE = "clickable";
const SELECTED = "selected";
const GOOD = "good";
const WRONG = "wrong";
const LOCKED = "locked";
const POLL = "poll";

import "./AnswerButton.css";

var AnswerButton = React.createClass({
    getInitialState: function(){
        return {
            mode:CLICKABLE
        };
    },
    componentWillReceiveProps: function(nextProps){
        this.setState({
           mode:nextProps.mode 
        });
    },
    action: function(){
      if(this.state.mode==CLICKABLE){
          this.props.action();
      }
    },
	render: function(){
        var className = "answer-buttton " + this.state.mode;
	 	return(
            <div>
                <button className={className} onClick = {this.action}>
                    {this.props.answerText}
                </button>
            </div>
        );
	}
});

export default AnswerButton;