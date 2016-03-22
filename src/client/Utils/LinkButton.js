import React from 'react';

var LinkButton = React.createClass({
  render: function(){
      var labelStyle = {
            fontSize: '200%', 
            textTransform: 'none',
            verticalAlign: 'middle',
        };
    // Au click, le bouton appelle la fonction définie dans sa props "handleLinkClick"
    return(
        <div>
            <button style = {labelStyle} className={this.props.className} onClick={this.props.handleLinkClick}>{this.props.text}</button>
        </div>
    );
  }
});

export default LinkButton;