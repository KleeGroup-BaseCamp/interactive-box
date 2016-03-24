import React from 'react';
import RaisedButton from 'material-ui/lib/raised-button';

const pStyle = {
    textAlign:'center', 
    marginTop:'5%'
};

var WaitPage = React.createClass({
    buttonStyle: {
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '50%',
        marginTop:'10%'
    },
    buttonStyle2: {
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '10%',
        width: '50%',
        textAlign: 'centered'
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
        var returnButton = <RaisedButton 
            label="Retour au choix des questionnaires" 
            onMouseDown={this.props.backward} 
            style={this.buttonStyle2}
            labelStyle={this.labelStyle}/>
  		var waitMessage = this.state.okToStart ? 
            "Tous les utilisateurs sont prêts" :
            "En attente de tous les utilisateurs";
        var waitLabel = <p style={pStyle}> {waitMessage} </p>
        
        // TODO ajouter la proportion d'utilisateurs enregistrés
        
  		return (<div>
                    {waitLabel}
                    {startButton}
                    {returnButton}
                </div>);
	}
});

export default WaitPage;