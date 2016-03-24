import React from 'react';
var BarChart = require("react-chartjs").Bar;

const colors = [
    '#607D8B', 
    '#FF5722', 
    '#795548', 
    '#FF9800', 
    '#FFC107', 
    '#FFEB3B', 
    '#CDDC39', 
    '#8BC34A', 
    '#4CAF50', 
    '#009688', 
    '#00BCD4', 
    '#00BCD4', 
    '#3F51B5', 
    '#673AB7', 
    '#9C27B0', 
    '#E91E63', 
    '#F44336'
]; 

//            chartData:{
//                labels: ["Bla", "Bla", "Bla"],
//                datasets: [{label: 'Resultats', data: []}]
//            }

var Chart = React.createClass({
    questionID: undefined,
    chartData: undefined,
	getInitialState: function(){
		return({
            values:[],
            visible:false
        });
	}, 
    componentWillReceiveProps: function(newProps){
        // but : regarder si c'est une nouvelle question ou pas
        if(!this.questionID || newProps.questionID != this.questionID){
            this.questionID = newProps.questionID;
            this.chartData = undefined;
        }
    },
    generateData:function(){
        if(!this.chartData){
            this.setState({values: this.zeroArray(this.props.labels.length), visible:this.state.values.length != 0});    
            var rand = colors[Math.floor(Math.random() * colors.length)];
            var truncatedLabels = this.props.labels.map(function(label){return label.substring(0,10);});
            this.chartData = {
                labels:truncatedLabels,
                datasets: [{label:'Resultats', data:this.state.values, fillColor: rand}]
            };
        } else {
            for(var i=0;i<this.chartData.datasets[0].data.length;i++){-
                this.chartData.datasets[0].data[i] = this.state.values[i];
            }
        }
    },
    zeroArray: function(n){
		return Array.apply(null, {length: n}).map(function() {return 0;});
	},
	componentWillMount: function(){
		var socket = this.props.socket;
		var self = this;
        
		socket.on("answer", function(indexOfAnswer){
            var values = self.state.values;
            values[indexOfAnswer] = values[indexOfAnswer] + 1;
            self.setState({values:values});
		});
 
        this.props.socket.on("showBarChart", function(){
            self.setState({visible:!self.state.visible});
        });
	},
	render: function(){
        var opacity = this.state.visible ? 1.0 : 0.0;
        var centerChartStyle = {
            marginLeft:'auto', 
            marginRight:'auto', 
            opacity:opacity, 
            width:'60%', 
            height:'20%', 
            marginTop:'3%', 
            display:'block'
        };
        this.generateData();

        if(this.chartData.labels && this.chartData.labels.length>0 && this.chartData.datasets[0].data){
            if(this.chartData.datasets[0].data.length == 0){
                for(var i = 0 ; i< this.chartData.labels.length; i++){
                    this.chartData.datasets[0].data.push(0);
                }
            }
            return <BarChart 
                data = {this.chartData}
                style={centerChartStyle}
                className="chart-class"
            />;
        } else {
            return <br></br>;
        }
	}
});

export default Chart;