import React from 'react';
import RaisedButton from 'material-ui/lib/raised-button';

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
        var heightPercent = 50/(this.props.nQuestions+1);
        var heightPercentText = heightPercent+'vmin';
        var marginPercent = heightPercent/this.props.nQuestions;
        var marginPercentText = marginPercent+'vmin';
        var buttonStyle = 
            {
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
                width: '70%',
                marginBottom: marginPercentText, 
                height: heightPercentText
            };
        var labelStyle = {
            fontSize: '5vmin', 
            textTransform: 'none'
        };
	 	return(
            <div>
                <RaisedButton label={this.props.answerText} onMouseDown={this.action} style={buttonStyle} className={className} labelStyle={labelStyle}/>
            </div>
        );
	}
});

export default AnswerButton;