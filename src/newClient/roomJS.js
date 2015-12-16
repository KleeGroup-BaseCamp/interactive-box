var RoomBox = React.createClass({
  render: function(){
    return(
      <div>
        <h1 className="index-title">Bienvenue dans la room?</h1>
      </div>
    );
  }
});

ReactDOM.render(
  <RoomBox/>,
  document.getElementById('content')
);