import React from 'react';
import RaisedButton from 'material-ui/lib/raised-button';

const pStyle = {
    textAlign:'center', 
    marginTop:'2%'
};

var EndPage = React.createClass({
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
  	render:function() {   
        var self = this;
        var relaunchButton = <RaisedButton 
            label="Lancer un autre quizz" 
            onMouseDown={self.props.redirect} 
            style={self.buttonStyle}
            labelStyle={self.labelStyle}/>
        var commentariesButton = <RaisedButton 
            label="Demander une adresse mail" 
            onMouseDown={self.props.goToMail} 
            style={self.buttonStyle}
            labelStyle={self.labelStyle}/>
  		var message = "Le quizz est terminé";
  		return (<div>
                    <p style={pStyle}>{message}</p>
                    {relaunchButton}
                    {commentariesButton}
                </div>
        );
	}
});

export default EndPage;