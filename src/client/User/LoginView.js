import io from 'socket.io-client';
import React from 'react';
var ReactDOM = require('react-dom');  

// Redirect for Room View
import RoomView from './Room';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';

//Etat du login
const NOT_CHOSEN = 'not_chosen';
const CHOSEN = 'chosen';

//Etat du textField
const TYPING = 'typing';
const ALREADY_USED_PSEUDO = 'already used';
const NO_PSEUDO = 'no pseudo';

var LoginBox = React.createClass({
    socket: undefined, 
    buttonStyle: {
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '70%',
        marginTop: '5%', 
        height: '10vmin'
    },
    labelStyle: {
        fontSize: '5vmin'
    },
    getInitialState: function() {
        return {pseudo: '', textFieldStatus:TYPING, loginStatus: NOT_CHOSEN};
    },
    updatePseudo: function(e){
        this.setState({pseudo: e.target.value, textFieldStatus:TYPING});
    },
    handleSubmit: function() {
        var pseudo = this.state.pseudo;
        if(!pseudo){
            this.state.textFieldStatus = NO_PSEUDO;
            return;
        }
        this.socket.emit("login-request", pseudo);
    },
    componentDidMount: function(){
        var t = this;
        // Focus sur le textField
        ReactDOM.findDOMNode(this.refs.inputPseudo).focus(); 
        this.socket  = io("/user");
        this.socket.on("login-valid", function(){ t.setState({loginStatus: CHOSEN}); });
        this.socket.on("already-used-pseudo", function(){ t.setState({textFieldStatus:ALREADY_USED_PSEUDO}); });
    },
    _renderLoginPage() {
        var errorTextToUse = this.state.textFieldStatus == NO_PSEUDO ? "Entrez un pseudo" : 
            this.state.textFieldStatus == ALREADY_USED_PSEUDO ? "Pseudo déjà utilisé" : "";
        
        return(
            <div className="middle-content">
                <h1 className="index-title">Choisis ton pseudo</h1>
                <div>
                    <TextField hintText="Pseudo"
                        onEnterKeyDown={this.handleSubmit}
                        onChange={this.updatePseudo}
                        ref="inputPseudo"
                        inputStyle={this.labelStyle}
                        style={this.buttonStyle}
                        errorText={errorTextToUse}/>
                </div>
                <div>
                    <RaisedButton label="Continuer" onMouseDown={this.handleSubmit} style={this.buttonStyle} labelStyle={this.labelStyle}/>
                </div>
            </div>
        );
    },
    _renderRoomPage() {
        return <RoomView socket={this.socket}/>;
    },

    render: function(){
        if (this.state.loginStatus === NOT_CHOSEN) {
            return this._renderLoginPage();
        } else if (this.state.loginStatus === CHOSEN) {
            return this._renderRoomPage();
        } else { 
            return <p>Fatale erreure, il y a un renard dans la poulailler</p>;
        }
    }
});
    export default LoginBox;
