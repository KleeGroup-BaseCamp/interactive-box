import io from 'socket.io-client';
import React from 'react';
var ReactDOM = require('react-dom');  

// Redirect for Room View
import RoomView from './Room';
import LinkButton from "../Utils/LinkButton";
import TextInput from "../Utils/TextInput";
    
const ROOM_TYPE = 'ROOM_TYPE';

var socket;

var LoginBox = React.createClass({
  getInitialState: function() {
    return {pseudo: ''};
  },
    
  _setUserToRoom: function () {
    this.setState({userType: ROOM_TYPE});
  },
    
  updatePseudo: function(e){
    this.setState({pseudo: e.target.value});
  },
  handleSubmit: function() {
    var pseudo = this.state.pseudo;
    if(!pseudo){
      return;
    }

    socket  = io("http://localhost:8080/user");
    var that = this;
    socket.emit("user");
    socket.emit("loginRequest", pseudo);
    socket.on("loginValid", function(){
        that._setUserToRoom();
    });
    socket.on("PseudoDejaUtilise", function(){
        alert("Pseudo déjà utilisé ! Choisissez un autre pseudo.");
    })
  },
    componentDidMount: function(){
        ReactDOM.findDOMNode(this.refs.inputPseudo).focus(); 
    },
  _renderLoginPage() {
    return(
      <div className="middle-content">
        <h1 className="index-title">Choisis ton pseudo</h1>
        <div>
          <TextInput placeholder="Pseudo" onChange={this.updatePseudo} onEnter={this.handleSubmit} ref="inputPseudo"/>
        </div>
        <div>
          <LinkButton className = "index-button" handleLinkClick={this.handleSubmit} text="Continuer"/>
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
