var socket = io.connect();
socket.emit("admin");

var QuizzAdminBox = React.createClass({
  getInitialState: function() {
    return {question:undefined};
  },
  nextQuestion: function(){
    socket.emit("readyToReceiveQuestion");
  },
  componentDidMount: function() {
    var component = this;
    socket.on("question", function(question){
      component.setState({question:question});
    });
    socket.on("no-more-questions", function(question){
      component.setState({question:undefined});
      alert("no more questions !");
    });
    this.nextQuestion();
  },
  render: function() {
    return (
      <div>
        <Question data={this.state.question}/>
        <button onClick={this.nextQuestion}>Prochaine question</button>
      </div>
    );
  }
});

var Question = React.createClass({
  render: function() {
    if(this.props.data){
    var answersList = this.props.data.answers.map(function(ans) {return (<li>{ans}</li>);});
      return (
        <div>
          <p> {this.props.data.text} </p>
          <ul> {answersList} </ul>
        </div>
      );
    } else {
      return (<p>Terminé !</p>);
    }
  }
});


ReactDOM.render(
  <QuizzAdminBox/>,
  document.getElementById('content')
);