var socket = io.connect();
socket.emit("admin");

var AdminBox = React.createClass({
  loadQuestionnariesFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  /*handleCommentSubmit: function(comment) {
        var comments = this.state.data;
    comment.id = Date.now();
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});

        $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },*/
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadQuestionnariesFromServer();
    //setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div>
        <h1>Administration du questionnaire</h1>
        <QuestsList data={this.state.data} />
      </div>
    );
  }
});

var QuestsList = React.createClass({
  render: function() {
    var questionnaryNodes = this.props.data.map(function(quest) {
      var count = quest.questions.length;
      return (
        <Questionnary title={quest.title} key={quest.id} author={quest.author} questionCount={count} id={quest.id}/>
      );
    });
    return (
      <div>
        {questionnaryNodes}
      </div>
    );
  }
});

var Questionnary = React.createClass({
  buttonAction: function(){
    var key = this.props.id;

      socket.emit("launchPoll", key);
      socket.on("goToPollPage", function(){
        window.location+="/quizz";
      });

  },
  render: function() {
    return (
      <div>
        <p><strong>{this.props.title}</strong> ({this.props.questionCount} questions)   -    {this.props.author}     <button onClick={this.buttonAction}>Lancer</button></p>
      </div>
    );
  }
});


ReactDOM.render(
  <AdminBox url="/questionnaries"/>,
  document.getElementById('content')
);