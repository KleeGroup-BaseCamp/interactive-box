import React from 'react';

var CountdownTimer = React.createClass({
    getInitialState: function() {
        return {secondsRemaining: 20};
    },
    tick: function() {
        this.setState({secondsRemaining: this.state.secondsRemaining - 1});
        if (this.state.secondsRemaining <= 0) {
            clearInterval(this.interval);
            this.props.timeOut();
        }
    },
    componentDidMount: function() {
        this.setState({ secondsRemaining: this.props.secondsRemaining });
        this.interval = setInterval(this.tick, 1000);
    },
    componentWillReceiveProps: function(nextProps){
        if(nextProps.secondsRemaining == 0){
            this.setState({secondsRemaining:nextProps.secondsRemaining});
        }
    },
    componentWillUnmount: function() {
        clearInterval(this.interval);
    },
    render: function() {
        if (this.state.secondsRemaining > 0){
            return (<div>Seconds Remaining: {this.state.secondsRemaining}</div>);
        } else {
            return (<p>Temps écoulé</p>);
        }
    }
});

export default CountdownTimer;