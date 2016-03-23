import React from 'react';
import ReactDOM from 'react-dom';

import AdminHome from './Admin/AdminHome'; 
import UserHome from './User/UserHome';
import ShowView from './Show/ShowRoom';
import AppBar from 'material-ui/lib/app-bar';

import "./index.css";

const element = <br></br>;

var Router = React.createClass({
    renderContent: function(){
        var hash = window.location.hash;
        if(hash==="#admin"){return(<AdminHome/>);}
        if(hash==="#show"){return(<ShowView/>);}
        return(<UserHome/>);
    },
    render: function(){
        var content = this.renderContent();
        return(
            <div>
                <AppBar 
                    title="Interactive box" 
                    iconElementLeft={element}
                />
                <div>
                    {content}
                </div>
            </div>
        );
    }
});

ReactDOM.render(
  <Router/>,
  document.getElementById('interactive-box')
);