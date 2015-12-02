// import dependencies
var express = require('express'), app = express(), http = require('http');

// start webserver on port 8080
var server =  http.createServer(app);
server.listen(8080);
app.use(express.static(__dirname + '/public'));

console.log("Server running on 127.0.0.1:8080");