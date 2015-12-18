import io from 'socket.io-client';
import React from 'react';

var LoginBox = React.createClass({
  getInitialState: function() {
    return {pseudo: ''};
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
    socket.emit("user");
    socket.emit("loginRequest", pseudo);
    socket.on("loginValid", function(){
      window.location+="/room";
    });

  },
  render: function(){
    return(
      <div>
        <h1 className="index-title">Et si vous entriez votre pseudo ?</h1>
        <div className="div-button">
          <TextInput placeholder="Pseudo" onChange={this.updatePseudo} onEnter={this.handleSubmit}/>
          <button className={this.props.className} onClick={this.handleSubmit}>Continuer</button>
        </div>
      </div>
    );
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
