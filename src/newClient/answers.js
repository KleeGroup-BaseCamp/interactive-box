import React from 'react';

var Answers = React.createClass({
    getInitialState: function(){
        return {answersLabels:[], alreadyAnswered:false};
    },
    componentDidMount: function(){
        var t  = this;
		this.props.socket.on("question", function(answersLabels){
            t.setState({answersLabels:answersLabels});
            t.setState({alreadyAnswered:false});
            console.log("ici");
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
                t.setState({alreadyAnswered:true});
        	};
        	return(<li><Answer action={chooseAnswer} key={index} isClickable={t.state.alreadyAnswered} label={label}/></li>);
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
      if(!this.props.isClickable){
          this.props.action();
      }
    },
	render: function(){
        var isClickable = !this.props.isClickable;
        var className = isClickable ? "answer-button" : "answer-button-blocked";
	 	return(
            <div>
                <button className={className} onClick = {this.action} key={this.props.index}>{this.props.label}</button>
            </div>
        );
	}
});

export default Answers;