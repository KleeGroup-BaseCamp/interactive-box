import React from 'react';

import { VirtualScroll } from 'react-virtualized';
import QuestionnaryButton from './QuestionnaryButton';
import 'react-virtualized/styles.css';
import "./ScrollableQuestionaryList.css"
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import {SelectableContainerEnhance} from 'material-ui/lib/hoc/selectable-enhance';
let SelectableList = SelectableContainerEnhance(List);

var ScrollableQuestionaryList = React.createClass({
    _noRowsRenderer : function() {
        return (
            <div>
                <p>Aucun questionnaire chargé</p>
            </div>
        )
    }, 
    render: function() {
        var quest = this.props.data[0];
        var self = this;
        var launchQuest = function(){
            self.props.launchQuizz(quest);
        }

        var i = -1;
        var data = this.props.data;
        var questTitles = this.props.data.map(function(title) {
            i++;
            var launchQuest = function(){
                self.props.launchQuizz(questi);
            };
            var questi=data[i]
            var count = questi.questions.length;
            var countLabel = count == 1 ? "question" : "questions";
            var label = count + " " + countLabel;
            var primaryText = <div>
                <p className="quest-title">{questi.title}</p>
                <p className="quest-count">{count} {countLabel}</p>
            </div>;
                
            return(
                <ListItem 
                    value = {1}
                    primaryText={primaryText}
                    onClick={launchQuest}
                />
            );
        });
        return (
            <SelectableList value={3}>
                {questTitles}
            </SelectableList>
        );
    }
});

export default ScrollableQuestionaryList;