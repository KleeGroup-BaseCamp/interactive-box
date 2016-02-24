import React from 'react';
import ReactCountdownClock from 'react-countdown-clock';

import Piechart from 'react-chartjs';

var PieChart = require("react-chartjs").Pie;



var CountdownTimer2 = React.createClass({

    duree: 10,
    chartOptions:{animationEasing: "easeOutCirc"},
   
    
    getInitialState: function() {
        this.duree = Number(this.props.duration);
        console.log("coucou");
        /*this.setState({ data:[{
            value: 10,
            color:"#F7464A",
            highlight:"#FF5A5E",
            label:"RED"
            }
        ]});*/
        return {data: [{
            value: 10,
            color:"#F7464A",
            highlight:"#FF5A5E",
            label:"RED"
            },
              {
            value: 0,
            color:"#FFEEEE",
            highlight:"#ABABAB",
            label:"BLUE"
            }
        ]};
    },
    
    componentDidMount: function() {
        
        this.setState({ secondsRemaining: this.props.duration });
        
        this.interval = setInterval(this.tick, 1000);
    },
     /*componentWillReceiveProps: function(nextProps){
        if(nextProps.secondsRemaining == 0){
            this.setState({secondsRemaining:nextProps.secondsRemaining});
        }
    },*/

    tick: function() {
        this.setState({secondsRemaining: this.state.secondsRemaining - 1});
        var newData = [{value: this.state.secondsRemaining, color:"#F7464A"}, {value: this.duree-this.state.secondsRemaining, color:"#FF0000"}];
        if (this.state.secondsRemaining <= 0) {
            clearInterval(this.interval);
            this.props.timeOut();
        }
        this.setState({data: newData});
    },

 render: function() {
        
        return(
        <div>
       <PieChart data={this.state.data} options={this.chartOptions}/>
        </div>
    );
    }
});

export default CountdownTimer2;