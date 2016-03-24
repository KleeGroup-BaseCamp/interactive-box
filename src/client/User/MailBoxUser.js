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
    updatePseudo: function(e){
        this.setState({pseudo: e.target.value, textFieldStatus:TYPING});
    },
    handleSubmit: function() {
        var email = this.state.email;
        if(email==''){
            this.state.textFieldStatus = NO_EMAIL;
            return;
        }
        var regex = /\S+@\S+\.\S+/;
        if(!regex.test(email)){
            this.state.textFieldStatus = NOT_VALID;
            return;
        }
        this.props.socket.emit("mail", email);
    },
    componentDidMount: function(){
        var self = this;
        
        // Focus sur le textField
        ReactDOM.findDOMNode(this.refs.inputPseudo).focus(); 
        
        this.props.socket.on("already-used-pseudo", function(){ self.setState({textFieldStatus:ALREADY_USED_PSEUDO}); });
    },
    _generateErrorText: function(){
        if(this.state.textFieldStatus == NO_PSEUDO){
            return "Entrez un pseudo";
        } else if(this.state.textFieldStatus == ALREADY_USED_PSEUDO){
            return "Pseudo déjà utilisé";
        } else {
            return '';
        }
    },
    render: function() {
        return(
            <div className="middle-content">
                <h1 className="index-title">Choisissez votre pseudo</h1>
                <div>
                    <TextField 
                        hintText="Pseudo"
                        onEnterKeyDown={this.handleSubmit}
                        onChange={this.updatePseudo}
                        ref="inputPseudo"
                        inputStyle={labelStyle}
                        style={buttonStyle}
                        errorText={this._generateErrorText()}/>
                </div>
                <div>
                    <RaisedButton 
                        label="Continuer"
                        onMouseDown={this.handleSubmit}
                        style={buttonStyle}
                        labelStyle={labelStyle}/>
                </div>
            </div>
        );
    }
});

export default MailBoxUser;