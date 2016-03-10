import React from 'react';

import { VirtualScroll } from 'react-virtualized';
import QuestionnaryButton from './QuestionnaryButton';
import 'react-virtualized/styles.css';
import "./ScrollableQuestionaryList.css"
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import {SelectableContainerEnhance} from 'material-ui/lib/hoc/selectable-enhance';
let SelectableList = SelectableContainerEnhance(List);

var ScrollableQuestionaryList2 = React.createClass({

    _noRowsRenderer : function() {
        return (
            <div>
                <p>Aucun questionnaire chargé</p>
            </div>
        )
    }, 
    
    
    
    
                                                  
        /*
                <QuestionnaryButton title={quest.title} key={quest.id} author={quest.author} questionCount={count} id={quest.id} launchQuizz = {launchQuest}/>
            </div>
               );*/
    
    
    render: function() {
        var launchQuest = function(){
            t.props.launchQuizz(quest);
        }
         var quest = this.props.data[0];
        console.log(this.props.data);
        var t = this;
        var launchQuest = function(){
            t.props.launchQuizz(quest);
        }
        //return quest.title;
        
        var i = -1;
        var data = this.props.data;
        var questTitles = this.props.data.map(function(title) {
            i++;
            var questi=data[i]
            var count = questi.questions.length;
            var countLabel = count == 1 ? "question" : "questions";
            var label = count + " " + countLabel;
	       return(
		        	<ListItem value = {1} primaryText={<div>
                    <p className="quest-title">{questi.title}</p>
                
                    <p className="quest-count">{count} {countLabel}</p>
                </div>} onClick={launchQuest} >
		            </ListItem>);
	        });
        return (
            <SelectableList value={3}>
            {questTitles}
        </SelectableList>
               );
        
    }, 
    
});

export default ScrollableQuestionaryList2;