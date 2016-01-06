import React from 'react';

var Answers = React.createClass({
    getInitialState: function(){
        return {answersLabels:[], selectedAnswer:undefined, timeOut:false};
    },
    componentDidMount: function(){
        var t  = this;
		this.props.socket.on("question", function(answersLabels){
            t.setState({answersLabels:answersLabels});
            t.setState({selectedAnswer:undefined});
            t.setState({timeOut:false});
            console.log("ici");
        });
        this.props.socket.on("end-time", function(){
            t.setState({timeOut:true});
            if(t.state.selectedAnswer){
                console.log("COUCOU");
            } else {
                console.log("kiki");
            }
        });

        t.setState({answersLabels:this.props.firsts});
    },
    render: function(){
       	var indexOfAnswer = -1;
		var t = this;
        var answersNodes = this.state.answersLabels.map(function(label) {
        	indexOfAnswer++;
        	var index = indexOfAnswer;
        	var chooseAnswer = function(){
        		t.props.socket.emit("answer", index);
                t.setState({selectedAnswer:index});
        	};
            var isBlocked = t.state.timeOut || !(t.state.selectedAnswer == undefined);
        	return(<li><Answer action={chooseAnswer} key={index} isClickable={!isBlocked} label={label}/></li>);
        });
		return(
			<div className="middle-content">
				<ul>{answersNodes}</ul>
			</div>
		);
   } 
});


var Answer = React.createClass({
    action: function(){
      if(this.props.isClickable){
          this.props.action();
      }
    },
	render: function(){
        var isClickable = this.props.isClickable;
        var className = isClickable ? "answer-button" : "answer-button-blocked";
	 	return(
            <div>
                <button className={className} onClick = {this.action} key={this.props.index}>{this.props.label}</button>
            </div>
        );
	}
});

export default Answers;