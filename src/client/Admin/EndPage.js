import React from 'react';
import RaisedButton from 'material-ui/lib/raised-button';

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
  		var message = "Le quizz est terminé";
  		return (<div>
                    {message}
                    {relaunchButton}
                </div>
        );
	}
});

export default EndPage;