var socket = io.connect();
socket.emit("admin");

var QuizzAdminBox = React.createClass({
  getInitialState: function() {
    return {question:undefined};
  },
  nextQuestion: function(){
    socket.emit("readyToReceiveQuestion");
    console.log("sent READY TO RECEIVEQUESTION");
  },
  componentDidMount: function() {
    var component = this;
    socket.on("question", function(question){
      component.setState({question:question});
    console.log("received question" + question);
    var ans = question.answers;
    socket.emit("readyToReceiveAnswers", ans);
    console.log("sent READYTORECEIVEANSWERS" + ans);
    });
    socket.on("no-more-questions", function(question){
      component.setState({question:undefined});
      alert("no more questions !");
    });
    this.nextQuestion();
    socket.on("answers", function(answers){
       component.setState({answers:answers}); 
    });

  },
  render: function() {
    return (
      <div>
        <Question data={this.state.question}/>
        <Reponses data = {this.state.answers}/>
        <button onClick={this.nextQuestion}>Prochaine question</button>
      </div>
    );
  }
});

var Question = React.createClass({
  render: function() {
    if(this.props.data){
      return (
        <div>
          <p> {this.props.data.text} </p>
        </div>
      );
    } else {
      return (<p>Terminé !</p>);
    }
  }
});

var Reponses = React.createClass({
   render: function() {
       if (this.props.data){
           var answersList = this.props.data.map(function(ans) {return(<li>{ans}</li>);});
       }
     return(
        <div>
          <ul> {answersList} </ul>
        </div>
            ) ; 
   } 
    
});

ReactDOM.render(
  <QuizzAdminBox/>,
  document.getElementById('content')
);