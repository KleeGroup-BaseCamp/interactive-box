var socket = io.connect();          
import Barchart from 'react-chartjs';

socket.emit("admin");

var QuizzAdminBox = React.createClass({
  getInitialState: function() {
    return {question:undefined, showResults: false};
      
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
       socket.emit("AskAnswers");
        console.log("emitted askAnswers");
       component.setState({answers:answers}); 
    });

  },
    showResults: function() {
        this.setState({ showResults: true });
    },
  render: function() {
    return (
      <div>
        <Question data={this.state.question}/>
        <Reponses data = {this.state.answers}/>
        <button onClick={this.nextQuestion}>Prochaine question</button>
        { this.state.showResults ? <answersChart /> : null }
        <button onClick={this.showResults}> Reponses</button>
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
           
//BARCHART




var AnswersData = {
    "labels": ['Reponse 1', 'Reponse 2', 'Reponse 3'],
    "datasets": [
        {
            label: 'Resultats',
            data: [0, 0, 0]
        }
    ]
};




/*const answersChart = React.createClass({
    getInitialState: function() {
        return {
            data:{
            labels: ['Reponse 1', 'Reponse 2', 'Reponse 3'],
            datasets: [
        {
            label: 'Resultats',
            data: [0, 0, 0]
        }
    ]
    }
        };
    },
    componentDidMount: function() {


        socket.on("Answer3", this.actuReponse3);
        socket.on("Answer2", this.actuReponse2);
        socket.on("Answer1", this.actuReponse1);
  },
      actuReponse1: function(){
        const newData = {...this.state.data};
        newData.datasets[0].data[0]++;  
        this.setState({ data: this.state.data });
},
        actuReponse2: function(){
        const newData = {...this.state.data};
        newData.datasets[0].data[1]++; 
        this.setState({ data: this.state.data });
},
        actuReponse3: function(){
        const newData = {...this.state.data};
        newData.datasets[0].data[2]++; 
        this.setState({ data: this.state.data });
},
        sendAnswer1: function(){
        var socket = io();
        socket.emit("answered1");
},
        sendAnswer2: function(){
        var socket = io();
        socket.emit("answered2");
},
        sendAnswer3: function(){
        var socket = io();
        socket.emit("answered3");
},
    
    render() {
        return (
            <div>
                <p>Les resultats sont:</p>
                <BarChart data = {this.state.data}/>
            <button onClick={this.sendAnswer1}>coucou1</button>
            <button onClick={this.sendAnswer2}>coucou2</button>
            <button onClick={this.sendAnswer3}>coucou3</button>
            </div>
        );
    }
});*/
           
           

ReactDOM.render(
  <QuizzAdminBox/>,
  document.getElementById('content')
);