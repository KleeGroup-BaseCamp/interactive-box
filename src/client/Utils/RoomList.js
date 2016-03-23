import React from 'react';

/*
    RoomList est un composant qui liste les utilisateurs qu'on lui envoie via un socket passé en props. 
    
    Props : 
        socket : Le socket qui reçoit les nouveaux utilisateurs, sous la forme d'un message "userName", avec comme donnée le pseudo de l'utilisateur à afficher. 
        maxNumber : Le nombre maximum de personnes à afficher
        intervalMS : Le nombre de millisecondes entre chaque changement
        
    State : 
        users : La liste des pseudos des utilisateurs
        
    TODO gérer la déconnexion d'un utilisateur
    
*/


var RoomList = React.createClass({
	getInitialState: function() {
	    return {users: [], startIndex:0};
	},
	componentDidMount: function() {
		var t = this;
		var socket = this.props.socket;
        socket.on("user-name", function(userName){
            t.addElement(userName); 
        });
        socket.on("remove-user-name", function(userName){
            t.removeElement(userName);
        });
        this.interval = setInterval(this.roll, this.props.intervalMS);
        socket.emit("ready-to-receive-users");
	},
	addElement: function(userName){
		this.setState(function(previousState, currentProps){
			var prevUsers = previousState.users;
			prevUsers.push(userName);
	    	return {users: prevUsers};
	    });
	},
    removeElement : function(userName){
		this.setState(function(previousState, currentProps){
			var prevUsers = previousState.users;
            var index = prevUsers.indexOf(userName);
            if (index > -1) {
                prevUsers.splice(index, 1);
            }
	    	return {users: prevUsers};
	    });
    },
    _generateLabel: function(count){
        return count == 1 ? " utilisateur connecté" : " utilisateurs connectés";
    },
    _renderCounterLabel: function(count){
        if(count == 0) {return(<div className="compteur">Aucun utilisateur connecté</div>);}
        var label = this._generateLabel(count);
        return(
            <div className="compteur">
                <span>{count}</span>
                {label}
           </div>);
    },
	render: function(){
        var usersSliced = this.rollTheList(this.state.users, this.state.startIndex, this.props.maxNumber);
        var roomiesList = usersSliced.map(function(userName) {
            return (<li className="user-name" key={userName}>{userName}</li>);
        });
        var counter = this._renderCounterLabel(this.state.users.length);
	    return (
            <div>
                {counter}
                <ul>{roomiesList}</ul>
            </div>
	    );
	},
    roll: function(){
        var t = this;
        //console.log(this.state.users.length, this.state.startIndex, (this.state.startIndex+1) % this.state.users.length);
        this.setState({startIndex : t.state.startIndex == t.state.users.length-1 ? 0 : t.state.startIndex+1}); 
    },
    componentWillUnmount: function() {
        clearInterval(this.interval);
    },
    rollTheList: function(list, startIndex, length){
        if(startIndex<=list.length){
            if(length>=list.length){
                return list;
            } else {
                if(startIndex+length<list.length){
                    return list.slice(startIndex, startIndex+length);
                } else {
                    var first = list.slice(startIndex, list.length);
                    var last = list.slice(0,length-first.length);
                    return first.concat(last);
                }
            }
        } else {
            return list;
        }
    }
});

export default RoomList;