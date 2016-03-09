import React from 'react';
import ReactDOM from 'react-dom';

import AdminView from './Admin/AdminView'; 
import ShowView from './Show/ShowRoom';
import LoginView from './User/LoginView';
import LinkButton from "./Utils/LinkButton";
import AppBar from 'material-ui/lib/app-bar';
import RaisedButton from 'material-ui/lib/raised-button';

import "./index.css";

const ADMIN_TYPE = 'ADMIN_TYPE';
const ATTENDEE_TYPE = 'ATTENDEE_TYPE';
const SHOW_TYPE = 'SHOW_TYPE';

const INITIAL_STATE = 'home';
const PSEUDO = 'pseudo';
const WAITING = 'waiting';

var WelcomeBox = React.createClass({
  getInitialState() {
      return {};
  },
  _setUserToAdmin() {
    this.setState({userType: ADMIN_TYPE});
  },
  _setUserToAttendee() {
      this.setState({userType: ATTENDEE_TYPE});
  },
    _setUserToShow(){
        this.setState({userType: SHOW_TYPE});  
    },
    _setUserToHome(){
        console.log("coucouc");
        this.setState({userType: undefined});  
    },
  _renderHomepage() {
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
      return(
        <div className="middle-content">
          <h1 className="index-title">Interactive box</h1>
          <div className="div-button">
            <RaisedButton label="Commencer" className="index-button-md" onMouseDown={this._setUserToAttendee} style={buttonStyle} labelStyle={labelStyle}/>
            <RaisedButton label="Administrateur" className="index-button-md" onMouseDown={this._setUserToAdmin} style={buttonStyle} labelStyle={labelStyle}/>
            <RaisedButton label="Présentation" className="index-button-md" onMouseDown={this._setUserToShow} style={buttonStyle} labelStyle={labelStyle}/>
          </div>
        </div>
      );
  },
  _renderAdminPage() {
      return <AdminView url='/questionnaries'/>;
  },
  _renderLoginPage() {
      return <LoginView/>;
  },
  _renderShowRoomPage(){
        return <ShowView/>;  
  },

  renderMiddle: function(){
    var userType = this.state.userType;
    if (userType === undefined) { // On ne connait pas l'utilisateur, ca veut dire qu'on doit lui demander qui il est
        return this._renderHomepage();
    } else if (userType === ADMIN_TYPE) { // L'utilisateur est un admin, affichons lui sa page
        return this._renderAdminPage();
    } else if (userType === ATTENDEE_TYPE) { // L'utilisateur est quelqu'un de l'assemblée, on lui file donc la page de login
        return this._renderLoginPage();
     } else if (userType === SHOW_TYPE) { // L'utilisateur est le présentateur, on lui file donc la page de présentation
        return this._renderShowRoomPage();
    } else { // Si on arrive ici c'est qu'on a mal fait le state, donc erreur
        return <p>Fatale erreure, il y a un renard dans la poulailler</p>;
    }
  },
  render: function(){
    var middleNode = this.renderMiddle();
    var element = <br></br>;
    return(
      <div>
         <AppBar 
            title="Interactive box" 
            iconElementLeft={element}
            onLeftIconButtonTouchTap={this._setUserToHome}/>
        <div>
          {middleNode}
        </div>
      </div>
    );
  }
});


ReactDOM.render(
  <WelcomeBox/>,
  document.getElementById('interactive-box')
);