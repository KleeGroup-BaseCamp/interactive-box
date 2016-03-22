import React from 'react';
import ReactCountdownClock from 'react-countdown-clock';

import Piechart from 'react-chartjs';

var PieChart = require("react-chartjs").Pie;

/*var SetIntervalMixin = {
  componentWillMount: function() {
    this.intervals = [];
  },
  setInterval: function() {
    this.intervals.push(setInterval.apply(null, arguments));
  },
  componentWillUnmount: function() {
    this.intervals.forEach(clearInterval);
  }
};*/

var CountdownTimer = React.createClass({

    duree: 10,
    chartOptions:{animation: false},
//    mixins: [SetIntervalMixin],
   
    
    getInitialState: function() {
        this.duree = Number(this.props.duration);
       
        return {data: [{
                value: 10,
                color:"#F7464A",
                highlight:"#FF5A5E",
            },
            {
                value: 0,
                color:"#FFEEEE",
                highlight:"#ABABAB",
            }
        ]};
    },
    
    componentDidMount: function() {
        
        this.setState({ secondsRemaining: this.props.duration });
        
        this.interval = setInterval(this.tick, 1000);
        this.setState({interval: this.interval});
    },
    componentWillUnmount () {
    this.interval && clearInterval(this.interval);
    this.interval = false;
},


    tick: function() {
        if (this.state.secondsRemaining >= 0) {
        this.setState({secondsRemaining: this.state.secondsRemaining - 1});
        var newData = [{value: this.state.secondsRemaining, color:"#F7464A"}, {value: this.duree-this.state.secondsRemaining, color:"#FF0000"}];
        }
        if (this.state.secondsRemaining <= 0) {
            clearInterval(this.state.interval);
            this.props.timeOut();
        }
        this.setState({data: newData});
    },

 render: function() {
        
        return(
        <div>
       <PieChart data={this.state.data} options={this.chartOptions} className="pie-chart-counter"/>
        </div>
    );
    }
});

export default CountdownTimer;