import React from 'react';
import ReactCountdownClock from 'react-countdown-clock';




var CountdownTimer = React.createClass({
   timeclock : 10, 
    getInitialState: function() {
        this.timeClock= Number(this.props.secondsRemaining);
        console.log("i entered get initial state");
        return {secondsRemaining: 20};
    },
    tick: function() {
        this.setState({secondsRemaining: this.state.secondsRemaining - 1});
        if (this.state.secondsRemaining <= 0) {
            clearInterval(this.interval);
            this.props.timeOut();
        }
    },
    componentWillMount: function() {
        //var timeClock= Number(this.props.secondsRemaining);
        console.log("i entered component will mount");
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
        var number = this.timeClock;
        return(
        <div>
        <p> ceci est le vrai compteur {this.state.secondsRemaining}</p>

        <ReactCountdownClock seconds= {number}
                     color="#0F98E9"
                     alpha={0.9}
                     size={100}
                     //onComplete={this.timeEnding()}
                      />
        </div>
    );
    }
});
            
/*var CountdownTimer3 = React.createClass({
    
    componentDidMount: function() {
        console.log("I did mount (countdown timer)");
        this.setState({ secondsRemaining: this.props.secondsRemaining });
       // this.timeEnding = debounce(this.timeEnding,1000);
    },
    timeEnding: function(){
       // this.setState({secondsRemaining:nextProps.secondsRemaining});
        console.log("on est dans le TimeOut");
        //this.props.timeOut();
        //this.interval = setInterval(this.props.timeOut(), 10000);
        
    },
    /*componentWillReceiveProps: function(nextProps){
        console.log("je suis dans le will receive props");
        if(nextProps.secondsRemaining == 0){
            console.log("setState secondsRemaining");
            this.setState({secondsRemaining:nextProps.secondsRemaining});
            console.log(this.state.secondsRemaining);
        }
    },*/
    
    /*render: function() {
        if (this.props.secondsRemaining > 0){
            console.log("secondsRemaining>0");
            var numberRemaining = Number(this.props.secondsRemaining);
            return (<ReactCountdownClock seconds={numberRemaining}
                     color="#0F98E9"
                     alpha={0.9}
                     size={100}
                     onComplete={this.timeEnding()}
                      />);
        } else {
            console.log("secondsRemaining<0");
            return (<p>Temps écoulé</p>);
        }
    }
});*/
            
/*<ReactCountdownClock seconds={60}
                     color="#000"
                     alpha={0.9}
                     size={300}
                      />*/

export default CountdownTimer;