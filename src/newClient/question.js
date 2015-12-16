var textQuestion = 'bière?';



var displayQuestion = React.createClass({
	componentDidMount: function() {
		var component = this;
		console.log("DID mount");
		var socket = io.connect();
        socket.on('Question', function(Question){
        textQuestion = Question.question;
        var answers = Question.answers;
    });
    },
    render: function() {
		console.log("RENDER");
        component.addElement(textQuestion);
	    var answersList = this.state.answers.map(function(answers) {
	      return (
	        <li>{answers}</li>
	      );
	    });
	    return (
	      <div>
          <p> {this.props.question} </p>
	      <ul> {answersList}
	      </ul>
	      </div>
	    );
  }
});

ReactDOM.render(
  <displayQuestion/>,
  document.getElementById('content')
);