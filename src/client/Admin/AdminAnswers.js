import React from 'react';
import Paper from 'material-ui/lib/paper';

var AdminAnswers = React.createClass({
    render: function(){
        var answersNodes = this.props.answersLabelsCorrect.map(function(labelCorrect) {
                var className = "answer-node " + (labelCorrect.correct ? "true" : "false");
                var paperStyle = {
                    height: '5%',
                    width: '80%',
                    marginLeft:'auto',
                    marginRight:'auto',
                    marginTop:'2%',
                    textAlign: 'center',
                    display: 'table', 
                    backgroundColor: labelCorrect.correct ? "#8BC34A" : "#F44336",
                    verticalAlign: 'middle',
                    color:'white',
                    fontWeight:'bold'
                };
                var pStyle={
                    display: 'table-cell',
                    verticalAlign: 'middle',
                    fontSize: '5vmin'
                };
	        	return(
		        	<Paper style={paperStyle} zDepth={2} rounded={false}>
		                <p style={pStyle}>{labelCorrect.label} </p>
		            </Paper>
                );
	        });
        return(
            <div>
                <ul>
                    {answersNodes}
                </ul>
            </div>
        );
    }
});

export default AdminAnswers;