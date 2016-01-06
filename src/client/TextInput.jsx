import React from 'react';

var TextInput = React.createClass({
  keyDown: function(e){
    if(e.keyCode == 13){
      this.props.onEnter();
    }
  },
  render: function(){
    return(
      <input className="text-input" placeholder={this.props.placeholder} onChange={this.props.onChange} onKeyDown={this.keyDown}></input>
    );
  }
});

export default TextInput;