


function arrayOfGoodAnswers(questionnary, index){
    var array = [];
    var maxIndex = questionnary.questions.length;
    if(index<maxIndex){
        var question = questionnary.questions[index];
        var answersIds = question.answers;
        var answersObjects = questionnary.answers;
        for(var i=0;i<answersIds.length;i++){
            for (var k = 0; k<answersObjects.length; k++){
                if (answersObjects[k].rid == answersIds[i]){
                    if(answersObjects[k].correct){
                        array.push(i);
                    }
                }
            }
        }
    }
    return array;
};

exports.arrayOfGoodAnswers = arrayOfGoodAnswers;