import React from 'react';

import { VirtualScroll } from 'react-virtualized';
import QuestionnaryButton from './QuestionnaryButton';
import 'react-virtualized/styles.css';
import "./ScrollableQuestionaryList.css"
var ScrollableQuestionaryList = React.createClass({

    _noRowsRenderer : function() {
        return (
            <div>
                <p>Aucun questionnaire chargé</p>
            </div>
        )
    },                                 
                                                  
    _rowRenderer : function(index) {
        var quest = this.props.data[index];
        console.log(this.props.data);
        var t = this;
        var launchQuest = function(){
            t.props.launchQuizz(quest);
        }
        //return quest.title;
        var label = quest.title;
        var count = quest.questions.length;
        var countLabel = count == 1 ? "question" : "questions";
        return (<div className="row" onClick={launchQuest}>
                <div>
                    <p className="quest-title">{label}</p>
                
                    <p className="quest-count">{count} {countLabel}</p>
                </div>
                </div>
               );
        /*
                <QuestionnaryButton title={quest.title} key={quest.id} author={quest.author} questionCount={count} id={quest.id} launchQuizz = {launchQuest}/>
            </div>
               );*/
    },
    
    render: function() {
        return(
            <div>
                <VirtualScroll 
                       className="scroll-list"
                       noRowsRenderer={this._noRowsRenderer}
                       height={this.props.height}
                       rowsCount={this.props.data.length}
                       rowHeight={100}
                       rowRenderer={this._rowRenderer}/>
            </div>
        );
    }, 
    
   
});

export default ScrollableQuestionaryList;