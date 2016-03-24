import React from 'react';
import RaisedButton from 'material-ui/lib/raised-button';

const pStyle = {
    textAlign:'center', 
    marginTop:'2%',
    marginBottom: '2%'
};

const liStyle = {
    textAlign:'center'
};

var MailBox = React.createClass({
    getInitialState: function(){
        return {mails:[]};    
    },
    buttonStyle: {
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '50%',
        marginTop:'3%', 
        marginBottom:'3%'
    },
    labelStyle: {
        textTransform: 'none'
    },
    componentDidMount: function(){
        var self = this;
        this.socket.on('mail', function(mail){
            var mails = self.state.mails;
            mails.push(mail);
            self.setState(mails);
        });    
    },
  	render:function() {   
        var self = this;
        var relaunchButton = <RaisedButton 
            label="Lancer un autre quizz" 
            onMouseDown={self.props.redirect} 
            style={self.buttonStyle}
            labelStyle={self.labelStyle}/>
  		var message = "Adresses envoyées : ";
        
        var mailsNodes = this.state.mails.map(function(mail){
            return <li style={liStyle}> mail </li>;    
        });
        
  		return (<div>
                    {relaunchButton}
                    <p style={pStyle}>{message}</p>
                    <ul>
                        {mailsNodes}
                    </ul>
                </div>
        );
	}
});

export default MailBox;