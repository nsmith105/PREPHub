'use strict'
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var socket = require('socket.io')(http);
// Socket IO Namespaces
var ioWeb = socket.of('/web');
var ioPi = socket.of('/pi');
/********* Express Routing *********/
app.use(express.static(__dirname));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/templates/local.html');
});

app.post('/twitter', (req, res) => {
  console.log("to send")
  ioWeb.emit('twitter data', req.body);
});

/********* Socket.io Stuff *********/
//* web namespace */
ioWeb.on('connection', function(socket){
    console.log("a web user has connected.");
    socket.on('send command', function(data){
      console.log('command received');
      ioPi.emit('send command', data);
    });
});
/* pi namespace */
ioPi.on('connection', function(socket){
    console.log("a pi user has connected.");
    socket.on('send command confirm', function(msg){
      console.log("command confirmation received from Pi");
      ioWeb.emit('send command confirm', msg);
  });
});
let port = process.env.PORT || 8080;
http.listen(port, function(){
  console.log('listening on: ' + port);
});
