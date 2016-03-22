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
                    backgroundColor: labelCorrect.correct ? "green" : "red",
                    verticalAlign: 'middle'
                };
                var pStyle={
                    display: 'table-cell',
                    verticalAlign: 'middle'
                };
	        	return(
		        	<Paper style={paperStyle} zDepth={2}>
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