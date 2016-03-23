import io from 'socket.io-client';
import React from 'react';

import AdminView from './AdminView';
import WaitPage from './WaitPage';
import Questionnary from './Questionnary';

const INDEX = 'index';
const WAIT = 'wait';
const QUESTIONNARY = 'questionnary';

var AdminHome = React.createClass({
    socket: undefined,
    getInitialState: function(){
        return({status:INDEX});
    }, 
    componentWillMount: function(){
        var self = this;
        this.socket = io("/admin");
    },
    render: function(){
        if(this.state.status == INDEX) {
            return(<AdminView socket={this.socket}/>);
        } else if(this.state.status == WAIT) {
            return(<WaitPage socket={this.socket}/>);
        } else if(this.state.status == QUESTIONNARY) {
            return(<Questionnary socket={this.socket}/>);
        } else {
            return(<p>Fatale erreur ! statut : {this.state.status}</p>);
        }
    }
});

export default AdminHome;