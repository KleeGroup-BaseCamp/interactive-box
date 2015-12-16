import React from 'react';
import ReactDOM from 'react-dom';
import Barchart from 'react-chartjs';

import io from 'socket.io-client';
//const socket = io('http://localhost:8080');

var BarChart = require("react-chartjs").Bar;
var value1 = 0;
var value2 = 0;
var value3 = 0;


var AnswersData = {
    "labels": ['Reponse 1', 'Reponse 2', 'Reponse 3'],
    "datasets": [
        {
            label: 'Resultats',
            data: [value1, value2, value3]
        }
    ]
};




const MyFirstComponent = React.createClass({
    getInitialState: function() {
        return {
            data:{
            labels: ['Reponse 1', 'Reponse 2', 'Reponse 3'],
            datasets: [
        {
            label: 'Resultats',
            data: [0, 0, 0]
        }
    ]
    }
        };
    },
    componentDidMount: function() {

        var socket = io();
        socket.on("Answer3", this.actuReponse3);
        socket.on("Answer2", this.actuReponse2);
        socket.on("Answer1", this.actuReponse1);
  },
      actuReponse1: function(){
        const newData = {...this.state.data};
        newData.datasets[0].data[0]++;  
        this.setState({ data: this.state.data });
},
        actuReponse2: function(){
        const newData = {...this.state.data};
        newData.datasets[0].data[1]++; 
        this.setState({ data: this.state.data });
},
        actuReponse3: function(){
        const newData = {...this.state.data};
        newData.datasets[0].data[2]++; 
        this.setState({ data: this.state.data });
},
        sendAnswer1: function(){
        var socket = io();
        socket.emit("answered1");
},
        sendAnswer2: function(){
        var socket = io();
        socket.emit("answered2");
},
        sendAnswer3: function(){
        var socket = io();
        socket.emit("answered3");
},
    
    render() {
        return (
            <div>
                <h1>Hello !</h1>
                <p>Les resultats sont:</p>
                <BarChart data = {this.state.data}/>
            <button onClick={this.sendAnswer1}>coucou1</button>
            <button onClick={this.sendAnswer2}>coucou2</button>
            <button onClick={this.sendAnswer3}>coucou3</button>
            </div>
        );
    }
});


ReactDOM.render(<MyFirstComponent data={AnswersData}/>, document.getElementById('interactive-box'));