import React from 'react';
import ReactDOM from 'react-dom';
import Barchart from 'react-chartjs';

import io from 'socket.io-client';
const socket = io('http://localhost:8080');

var BarChart = require("react-chartjs").Bar;
var value1 = 0;
var value2 = 1;
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
            data: [1, 2, 3]
        }
    ]
    }
        };
    },
    componentDidMount() {
      socket.on('Reponse3', this.actuReponse3);
  },
      actuReponse1: function(){
        this.state.data.datasets[0].data[0]++;  
        this.setState({ data: this.state.data });
},
        actuReponse2: function(){
        this.state.data.datasets[0].data[1]++;  
        this.setState({ data: this.state.data });
        socket.emit('answered');
},
        actuReponse3: function(){
        this.state.data.datasets[0].data[2]++;  
        this.setState({ data: this.state.data });
},
    render() {
        return (
            <div>
                <h1>Hello !</h1>
                <p>Les resultats sont:</p>
                <BarChart data = {this.state.data}/>
            <button onClick={this.actuReponse1}>coucou1</button>
            <button onClick={this.actuReponse2}>coucou2</button>
            <button onClick={this.actuReponse3}>coucou3</button>
            <p>{AnswersData.datasets[0].data[1]}</p>
            </div>
        );
    }
});


ReactDOM.render(<MyFirstComponent data={AnswersData}/>, document.getElementById('interactive-box'));