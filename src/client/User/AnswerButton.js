import React from 'react';
import RaisedButton from 'material-ui/lib/raised-button';
var ReactFitText = require('react-fittext');

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
            fontSize: '200%', 
            textTransform: 'none',
            verticalAlign: 'middle', 
            textAlign:'center'
        };
        var pStyle = {
            textAlign:'center',
            fontSize:'100%',
            position:'absolute',
            top: "50%",
            left:"50%",
            width:'90%',
            transform: "translate(-50%, -50%)"};
        var divStyle = {height:'100%', position:'relative'};
	 	return(
            <div>
                <RaisedButton 
                    onMouseDown={this.action} 
                    style={buttonStyle} 
                    className={className} 
                    labelStyle={labelStyle}
                    disabled={this.state.mode != CLICKABLE}
                    disabledBackgroundColor={this.state.mode == LOCKED ? 'lightgrey' : backgroundColor}
                    backgroundColor={backgroundColor}
                >   
                    <div style={divStyle}>
                        <p style={pStyle}>{this.props.answerText}</p>
                    </div>
                </RaisedButton>
            </div>
        );
	}
});

export default AnswerButton;