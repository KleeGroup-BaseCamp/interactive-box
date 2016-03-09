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
    render: function(){
        return(<span>{this.state.counter}</span>);
    }
});

export default SimpleCounter;