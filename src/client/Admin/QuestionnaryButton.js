import React from 'react';

var QuestionnaryButton = React.createClass({
  buttonAction: function(){
    this.props.launchQuizz();
  },
  render: function() {
    return (
    <div>
      <div className="questionnary" onClick={this.buttonAction}>
        <p><strong>{this.props.title}</strong> ({this.props.questionCount} questions) <br></br> par {this.props.author}  <br></br> </p>
        </div>
        <br></br>
      </div>
    );
  }
});

export default QuestionnaryButton;