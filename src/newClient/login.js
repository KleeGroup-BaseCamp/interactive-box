import io from 'socket.io-client';
import React from 'react';

// Redirect for Room View
import RoomView from '../newClient/roomJS';

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
      <div>
        <h1 className="index-title">Et si vous entriez votre pseudo ?</h1>
        <div className="div-button">
          <TextInput placeholder="Pseudo" onChange={this.updatePseudo} onEnter={this.handleSubmit}/>
          <button className={this.props.className} onClick={this.handleSubmit}>Continuer</button>
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


var TextInput = React.createClass({
  keyDown: function(e){
    if(e.keyCode == 13){
      this.props.onEnter();
    }
  },
  render: function(){
    return(
      <input placeholder={this.props.placeholder} onChange={this.props.onChange} onKeyDown={this.keyDown}></input>
    );
  }
});

// Pareil que pour admin.js

// ReactDOM.render(
//   <LoginBox/>,
//   document.getElementById('content')
// );

export default LoginBox;
