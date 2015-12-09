import React from 'react';
import ReactDOM from 'react-dom';
import Barchart from 'react-chartjs';

var BarChart = require("react-chartjs").Bar;
var value1 = 0;
var value2 = 0;
var value3 = 0;

const MyFirstComponent = React.createClass({
    render() {
        return (
            <div>
                <h1>Hello !</h1>
                <p>Les resultats sont:</p>
                <BarChart data = {Data}/>
            </div>
        );
    }
});


var Data = {
    labels: ['Reponse 1', 'Reponse 2', 'Reponse 3'],
    datasets: [
        {
            label: 'Resultats',
            data: [value1, value2, value3]
        }
    ]
};


/*React.render(
    <react_fc.FusionCharts {...chartConfigs} />,
    document.getElementById("chart-container")
);*/


ReactDOM.render(<MyFirstComponent/>, document.getElementById('interactive-box'));
