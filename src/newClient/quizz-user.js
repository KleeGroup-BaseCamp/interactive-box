var socket = io.connect();
var test =0;
socket.emit("user");


var QuizzUserBox = React.createClass({
  getInitialState: function() {
    return {answers:undefined};
  },
    
  componentDidMount: function() {
      console.log("entering consoleDidMount");
      socket.on("AskAnswers", function(){
         socket.emit("userWaitingForAnswers") ;
          console.log("sent UserWaitingForAnswers");
      });
      socket.on("Questionnary", function(){
          socket.emit("LoadQuestionnary", questionnary);
          console.log("user received questionnary");
      });
   

  },
  render: function() {
      console.log("rendering");
    return (
      <div>
        <Reponses/>
      </div>
    );
  }
});



var Reponses = React.createClass({
   componentDidMount: function(){
       var component = this;
       console.log("reponse did mount");
        socket.on("answers", function(answers){
        console.log(answers);
       component.setState({answers:answers}); 
        console.log("user received answers" + component.state.answers);
    });
   },
      getInitialState: function() {
    return {answers:undefined};
  },
    render: function() {
        if(this.state.answers) {
        var answersList = this.state.answers.map(function(ans) {
            return(
            <li>
                <button>{ans}</button>
            </li>
            );
        });
        console.log("answerList est " + answersList);
                                                               
        return(
        <div>
            <ul> {answersList} </ul>
        </div>
        ) ; 
        } else{
            return(<p>nn</p>);
        }
   } 
    
});


ReactDOM.render(
  <QuizzUserBox/>,
  document.getElementById('content')
);