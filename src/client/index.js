import React from 'react';
import ReactDOM from 'react-dom';

var WelcomeBox = React.createClass({
  render: function(){
    return(
      <div>
        <h1 className="index-title">Welcome</h1>
        <div className="div-button">
          <LinkButton className="col-xs-6 col-md-6 index-button" text="Administrateur" url="admin"/>
          <p></p>
          <LinkButton className="col-xs-6 col-md-6 index-button" text="Utilisateur" url="login"/>
        </div>
      </div>
    );
  }
});

var LinkButton = React.createClass({
  gotoPage: function(){
    if(this.props.url)
      window.location.href='./'+this.props.url;
  },
  render: function(){
    return(
        <div>
            <button className={this.props.className} onClick={this.gotoPage}>{this.props.text}</button>
        </div>
    );
  }
});

ReactDOM.render(
  <WelcomeBox/>,
  document.getElementById('interactive-box')
);