import React from 'react';
import RaisedButton from 'material-ui/lib/raised-button';

var WaitPage = React.createClass({
	getInitialState: function(){
		return {okToStart:false}
	},
    componentWillReceiveProps: function(newProps){
        this.setState({okToStart:newProps.okToStart});
    },
  	render:function() {
        
        var buttonStyle = 
            {
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
                width: '50%',
                marginTop:'10%'
            };
        var labelStyle = {
            textTransform: 'none'
        };
        var startButton = <RaisedButton 
                                label="Commencer le quizz" 
                                onMouseDown={this.props.launchQuizz} 
                                style={buttonStyle}
                                disabled={!this.state.okToStart}
                                labelStyle={labelStyle}/>
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