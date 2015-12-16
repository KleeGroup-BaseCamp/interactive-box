var socket = io.connect();
socket.emit("admin");

var QuizzAdminBox = React.createClass({
  getInitialState: function() {
    return {questions: []};
  },
  componentDidMount: function() {
    var component = this;
    socket.on("questionsArray", function(questionsArray){
      component.setState({questions:questionsArray});
    });
    socket.emit("readyToShowPoll");
  },
  nextQuestion: function(){

  },
  render: function() {
    return (
      <div>
        <QuestionnaryTitle/>
        <Question/>
        <button onClick={this.nextQuestion}>Prochaine question</button>
      </div>
    );
  }
});

var QuestionnaryTitle = React.createClass({
  getInitialState: function() {
    return {title: ""};
  },
  componentDidMount: function() {
    var component = this;
    socket.on("questionnaryTitle", function(titleText){
      component.setState({title:titleText});
    });
  },
  render: function() {
    return (
      <h2>{this.state.title}</h2>
    );
  }
});

var Question = React.createClass({
  getInitialState: function() {
    return {title: ""};
  },
  render: function() {
    // TODO answers
    return (
      <div>
        <h3>{this.state.title}</h3>
      </div>
    );
  }
});


ReactDOM.render(
  <AdminBox url="/questionnaries"/>,
  document.getElementById('content')
);