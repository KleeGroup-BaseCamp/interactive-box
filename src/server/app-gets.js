var express = require('express');
var path = require("path");
var fs = require('fs');

exports.app = express();
var app = exports.app;

function createLink(key, adress){
	app.get(key,function (req,res){res.sendFile(path.join(__dirname, adress));});
}

createLink("/oldadmin", "../client/admin/admin.html");
createLink("/login", "../newClient/login.html");
createLink("/loginJS", "../newClient/login.js");
createLink("/login/room", "../newClient/room.html");
createLink("/roomJS", "../newClient/roomJS.js");
createLink("/admin", "../newClient/admin.html");
createLink("/adminJS", "../newClient/admin.js");


// QUESTIONNARIES FILE
var QUESTIONNARIES_FILE = path.join(__dirname, '/questionnaries.json');
app.get('/questionnaries/', function(req, res) {
  fs.readFile(QUESTIONNARIES_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    res.setHeader('Cache-Control', 'no-cache');
    res.json(JSON.parse(data));
  });
});



app.get('/user/room',function (req,res){res.sendFile(path.join(__dirname+'../client/user/room/index.html'));});
app.get('/user/room/quizz',function (req,res){res.sendFile(path.join(__dirname+'../client/user/room/quizz/index.html'));});
app.get('/session-index', function (req, res, next) {
  req.session.index = (req.session.index || 0) + 1;
  res.write("Index : " + req.session.index + " : " + req.sessionID);
  res.end();
});


// Ce que j'aimerai bien faire : 

/*
var React = require('react-dom');
var ReactApp = React.createFactory(require("./element.jsx").ReactApp);
app.get('/test/', function(req, res){
        // React.renderToString takes your component
        // and generates the markup
        var reactHtml = React.renderToString(ReactApp({}));
        // Output html rendered by react
        // console.log(myAppHtml);
        res.sendFile(reactHtml);
    });
*/