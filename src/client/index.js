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

var Header = React.createClass({
    render: function(){
        var element = <br></br>;
        return(
            <AppBar title="Interactive box" iconElementLeft={element}/>
        );
    }
});

var Footer = React.createClass({
  render: function(){
    return(
      <div className="feader">
        <h4 className="feaderTitle">(c) Interactive Box</h4>
      </div>
    );
  }
});

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
  _renderHomepage() {
      return(
        <div className="middle-content">
          <h1 className="index-title">Bienvenue</h1>
          <div className="div-button">
            <RaisedButton label="Commencer" className="index-button-md" onMouseDown={this._setUserToAttendee}/>
            <LinkButton className="index-button-big" handleLinkClick={this._setUserToAttendee} text="Commencer !" url="login"/>
            <LinkButton className="index-button" handleLinkClick={this._setUserToAdmin} text="Administrateur" url="admin"/>
           <LinkButton className="index-button" handleLinkClick={this._setUserToShow} text="Presentation" url="showRoom"/>
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
    return(
      <div>
        <Header title="Interactive box"/>
        <div>
          {middleNode}
        </div>
        <Footer/>
      </div>
    );
  }
});


ReactDOM.render(
  <WelcomeBox/>,
  document.getElementById('interactive-box')
);