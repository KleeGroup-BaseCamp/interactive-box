import React from 'react';

var SimpleCounter = React.createClass({
    getInitialState: function(){
       return {counter:0};
    }, 
    componentDidMount: function(){
        var t = this;
        this.props.socket.on(this.props.fixCountMessage, function(count){
            t.setState({counter: count});
        });
        this.props.socket.on(this.props.addMessage, function(){
            t.setState({counter: t.state.counter+1});
        });
        this.props.socket.on(this.props.removeMessage, function(){
            t.setState({counter: t.state.counter-1});
        });
    },
    _generateLabel: function(){
        if(this.state.counter == 1) {return " utilisateur connecté";}
        return " utilisateurs connectés";
    },
    render: function(){
        if(this.state.counter == 0) {return(<div className="compteur">Aucun utilisateur connecté</div>);}
        var label = this._generateLabel();
        return(<div className="compteur">
                    <span>{this.state.counter}</span>
                    {label}
               </div>);
    }
});

export default SimpleCounter;