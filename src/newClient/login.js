import io from 'socket.io-client';
import React from 'react';

// Redirect for Room View
import RoomView from '../newClient/roomJS';
import LinkButton from "../client/linkButton.jsx";
import TextInput from "../client/TextInput.jsx";

const ROOM_TYPE = 'ROOM_TYPE';

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
    console.log("LETS LOG IN !");
    var pseudo = this.state.pseudo;
    if(!pseudo){
      return;
    }

    var socket  = io.connect();
      var that = this;
    socket.emit("user");
    socket.emit("loginRequest", pseudo);
    socket.on("loginValid", function(){
        that._setUserToRoom();
    });
    
  },
    
  _renderLoginPage() {
    return(
      <div className="middle-content">
        <h1 className="index-title">Entrez votre pseudo</h1>
        <div>
          <TextInput placeholder="Pseudo" onChange={this.updatePseudo} onEnter={this.handleSubmit}/>
        </div>
        <div>
          <LinkButton handleLinkClick={this.handleSubmit} text="Continuer"/>
        </div>
      </div>
    );
  },
    
  _renderRoomPage() {
      return <RoomView />;
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




// Pareil que pour admin.js

// ReactDOM.render(
//   <LoginBox/>,
//   document.getElementById('content')
// );

export default LoginBox;
