var LoginBox = React.createClass({
  render: function(){
    return(
      <div>
        <h1 className="index-title">Et si vous entriez votre pseudo ?</h1>
        <div className="div-button">
          <TextInput placeholder="Pseudo"/>
          <ActionButton className="col-xs-6 col-md-6 index-button" text="Continuer"/>
        </div>
      </div>
    );
  }
});


var TextInput = React.createClass({
  render: function(){
    return(
      <input placeholder={this.props.placeholder}></input>
    );
  }
});

var ActionButton = React.createClass({
  action: function(){
    console.log("ACTION IS NOT SET");
  },
  render: function(){
    return(
      <button className={this.props.className} onClick={this.action}>{this.props.text}</button>
    );
  }
});

ReactDOM.render(
  <LoginBox/>,
  document.getElementById('content')
);