import React from 'react';

import QuestionnaryButton from './QuestionnaryButton';

var QuestionnaryButtonsList = React.createClass({

  render: function() {
    var questList = this;
    var questionnaryNodes = this.props.data.map(function(quest) {
      var launchQuest = function(){
        questList.props.launchQuizz(quest);
      }
      var count = quest.questions.length;
      return (
        <QuestionnaryButton title={quest.title} key={quest.id} author={quest.author} questionCount={count} id={quest.id} launchQuizz = {launchQuest}/>
      );
    });
    return (
      <div>
        {questionnaryNodes}
      </div>
    );
  }
});

export default QuestionnaryButtonsList;