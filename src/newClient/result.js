import React from 'react';

const GOOD_ANSWER = "good";
const WRONG_ANSWER = "wrong";
const NO_ANSWER = "no";
const NEUTRAL = "neutral";

var Result = React.createClass({
    chooseFromStatus: function(list){
        var a = this.props.answerState;
        if(a==GOOD_ANSWER){
            return list[0];
        } else if(a==WRONG_ANSWER){
            return list[1];
        } else if (a==NO_ANSWER){
            return list[2];
        } else if(a==NEUTRAL){
            return list[3];
        } else {
            return undefined;
        } 
    },
    render: function(){
        var answer = this.props.answerStatus;
        var imageURL = this.chooseFromStatus([
            "http://i2.kym-cdn.com/photos/images/original/000/514/589/66b.jpg", 
            "http://i3.kym-cdn.com/photos/images/original/000/000/122/bush_doing_it_wrong_1.jpg", 
            "http://cdn.meme.am/instances/500x/58542873.jpg", 
            "http://www.quickmeme.com/img/29/295079a2bdd9913e2d8a7f801cf947b77b63f998d2942ffb2b5435d30b89d3b3.jpg"]);
        var text = this.chooseFromStatus([
            "Bravo, vous avez trouvé !", 
            "Oh, non, trop nul", 
            "Bah alors, pas assez rapide ?", 
            "Vous savez, je ne pense pas qu'il y ait de bonne ou de mauvaise réponse de toute façon"]);
        var answers = this.props.answersList;
        return(
            <div>
                <img src={imageURL} height="120"/>
                <p>{text}</p>
            </div>
        );
   } 
});


export default Result;