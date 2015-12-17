
var test =0;

var QuizzUserBox = React.createClass({
  getInitialState: function() {
    return {answers:undefined};
  },
  componentDidMount: function() {
      test = 2;
    socket.on("answers", function(answers){
       this.setState({answers:answers});
       test = 1; 
    });

  },
  render: function() {
    return (
      <div>
        <p>testUserBox</p>
        <p>{test}</p>
        <p>{this.state.answers}</p>
        <Reponses data = {this.state.answers}/>
      </div>
    );
  }
});



var Reponses = React.createClass({
   render: function() {
       if (this.props.data){
           var answersList = this.state.data.map(function(ans) {return(<li>{ans}</li>);});
       }
     return(
        <div>
        <p>test</p>
        
          <ul> {answersList} </ul>
        </div>
            ) ; 
   } 
    
});


ReactDOM.render(
  <QuizzUserBox/>,
  document.getElementById('content')
);