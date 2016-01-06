import React from 'react';

var LinkButton = React.createClass({
  render: function(){
    // Au click, le bouton appelle la fonction définie dans sa props "handleLinkClick"
    return(
        <div>
            <button className="index-button" onClick={this.props.handleLinkClick}>{this.props.text}</button>
        </div>
    );
  }
});

export default LinkButton;