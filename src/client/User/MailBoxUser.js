import io from 'socket.io-client';
import React from 'react';

import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';

//Etat du textField
const TYPING = 'typing';
const NOT_VALID = 'not_valid';
const NO_EMAIL = 'no email';

const buttonStyle = {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '70%',
    marginTop: '5%', 
    height: '10vmin'
};

const labelStyle = {
    fontSize: '5vmin'
};



var MailBoxUser = React.createClass({
    getInitialState: function() {
        return {email: '', textFieldStatus:TYPING};
    },
    updateMail: function(e){
        this.setState({email: e.target.value, textFieldStatus:TYPING});
    },
    handleSubmit: function() {
        var email = this.state.email;
        if(email==''){
            this.setState({textFieldStatus:NO_EMAIL});
            return;
        }
        var regex = /\S+@\S+\.\S+/;
        if(!regex.test(email)){
            this.setState({textFieldStatus:NOT_VALID});
            return;
        }
        this.props.socket.emit("mail", email);
        this.props.goToEnd();
    },
    _generateErrorText: function(){
        if(this.state.textFieldStatus == NO_EMAIL){
            return "Entrez une adresse email";
        } else if(this.state.textFieldStatus == NOT_VALID){
            return "Adresse non valide";
        } else {
            return '';
        }
    },
    render: function() {
        var errorText = this._generateErrorText();
        return(
            <div className="middle-content">
                <h1 className="index-title-little">Partagez votre adresse email</h1>
                <div>
                    <TextField 
                        hintText="Adresse email"
                        onEnterKeyDown={this.handleSubmit}
                        onChange={this.updateMail}
                        inputStyle={labelStyle}
                        style={buttonStyle}
                        errorText={errorText}/>
                </div>
                <div>
                    <RaisedButton 
                        label="Envoyer"
                        onMouseDown={this.handleSubmit}
                        style={buttonStyle}
                        labelStyle={labelStyle}/>
                </div>
            </div>
        );
    }
});

export default MailBoxUser;