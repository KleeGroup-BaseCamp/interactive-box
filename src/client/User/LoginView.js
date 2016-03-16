import io from 'socket.io-client';
import React from 'react';
var ReactDOM = require('react-dom');  

// Redirect for Room View
import RoomView from './Room';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';

const ROOM_TYPE = 'ROOM_TYPE';

var socket;

var LoginBox = React.createClass({
  getInitialState: function() {
    return {pseudo: '', alreadyUsedPseudo:false};
  },
    
  _setUserToRoom: function () {
    this.setState({userType: ROOM_TYPE});
  },
    
  updatePseudo: function(e){
    this.setState({pseudo: e.target.value, alreadyUsedPseudo:false});
  },
  handleSubmit: function() {
    var pseudo = this.state.pseudo;
    if(!pseudo){
      return;
    }
    socket.emit("user");
    socket.emit("loginRequest", pseudo);
  },
    componentDidMount: function(){
        var t = this;
        ReactDOM.findDOMNode(this.refs.inputPseudo).focus(); 
        socket  = io("http://127.0.0.1:8080/user");
        socket.on("loginValid", function(){
            t._setUserToRoom();
        });
        socket.on("PseudoDejaUtilise", function(){
            t.setState({alreadyUsedPseudo:true});
        });
    },
  _renderLoginPage() {
      var buttonStyle = {
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '70%',
        marginTop: '5%', 
        height: '10vmin'
    };
    var labelStyle = {
        fontSize: '5vmin'  
    };
    var errorTextToUse = this.state.alreadyUsedPseudo ? "Pseudo déjà utilisé" : "";
    return(
      <div className="middle-content">
        <h1 className="index-title">Choisis ton pseudo</h1>
        <div>
            <TextField hintText="Pseudo"
                onEnterKeyDown={this.handleSubmit}
                onChange={this.updatePseudo}
                ref="inputPseudo"
                inputStyle={labelStyle}
                style={buttonStyle}
                errorText={errorTextToUse}/>
        </div>
        <div>
            <RaisedButton label="Continuer" onMouseDown={this.handleSubmit} style={buttonStyle} labelStyle={labelStyle}/>
        </div>
      </div>
    );
  },
    
  _renderRoomPage() {
      return <RoomView socket={socket}/>;
  },
    
  render: function(){
    var userType = this.state.userType;
    if (userType === undefined) { // Il n'a pas été défini comme dans la room --> Il reste dans Login
        return this._renderLoginPage();
    } else if (userType === ROOM_TYPE) { // L'utilisateur va dans la room
        return this._renderRoomPage();
    } else { // Si on arrive ici c'est qu'on a mal fait le state, donc erreur
        return <p>Fatale erreure, il y a un renard dans la poulailler</p>;
    }
  }
  });
export default LoginBox;
