import React from 'react';
import RaisedButton from 'material-ui/lib/raised-button';

var WaitPage = React.createClass({
    buttonStyle: {
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '50%',
        marginTop:'10%'
    },
    labelStyle: {
        textTransform: 'none'
    },
	getInitialState: function(){
		return {okToStart:false}
	},
    componentDidMount: function(){
        var self = this;
        this.props.socket.on("all-users-are-ready", function(){
            self.setState({okToStart: true});
        });
    },
  	render:function() {   
        var startButton = <RaisedButton 
            label="Commencer le quizz" 
            onMouseDown={this.props.launchQuizz} 
            style={this.buttonStyle}
            disabled={!this.state.okToStart}
            labelStyle={this.labelStyle}/>
  		var waitMessage = this.state.okToStart ? 
            "Tous les utilisateurs sont prêts" :
            "En attente de tous les utilisateurs";
        var waitLabel = <p className="center-text"> {waitMessage} </p>
        
        // TODO ajouter la proportion d'utilisateurs enregistrés
        
  		return (<div>
                    {waitLabel}
                    {startButton}
                </div>);
	}
});

export default WaitPage;