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
    _findBackgroundColor: function(){
        if(this.state.mode==CLICKABLE){return 'white';}                     
        if(this.state.mode==SELECTED){return '#93b1e0';}                     
        if(this.state.mode==LOCKED){return '#e3e3e3';}                     
        if(this.state.mode==POLL){return 'white';}                     
        if(this.state.mode==GOOD){return '#b6edc1';}                     
        if(this.state.mode==WRONG){return '#dba8a8';}                     
    },        
	render: function(){
        var className = "answer-buttton " + this.state.mode;
        var heightPercent = 50/(this.props.nQuestions+1);
        var heightPercentText = heightPercent+'vmin';
        var marginPercent = heightPercent/this.props.nQuestions;
        var marginPercentText = marginPercent+'vmin';
        var backgroundColor = this._findBackgroundColor();
        console.log(backgroundColor);
        var buttonStyle = 
            {
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
                width: '70%',
                marginBottom: marginPercentText, 
                height: heightPercentText, 
            };
        var labelStyle = {
            fontSize: '5vmin', 
            textTransform: 'none'
        };
	 	return(
            <div>
                <RaisedButton 
                    label={this.props.answerText} 
                    onMouseDown={this.action} 
                    style={buttonStyle} 
                    className={className} 
                    labelStyle={labelStyle}
                    backgroundColor={backgroundColor}/>
            </div>
        );
	}
});

export default AnswerButton;