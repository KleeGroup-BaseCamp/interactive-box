var express = require('express');
var path = require("path");
var fs = require('fs');

exports.app = express();
var app = exports.app;

// Questionnaires

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

exports.questFile = QUESTIONNARIES_FILE;

//Images

app.get('/correct', function(req,res){res.sendFile(path.join(__dirname+'/rsc/correct.png'));});
app.get('/incorrect', function(req,res){res.sendFile(path.join(__dirname+'/rsc/incorrect.png'));});
app.get('/like', function(req,res){res.sendFile(path.join(__dirname+'/rsc/like.png'));});
app.get('/time', function(req,res){res.sendFile(path.join(__dirname+'/rsc/time.png'));});
