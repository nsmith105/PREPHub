'use strict'
var express = require('express');
var app = express();
var http = require('http').Server(app);
var socket = require('socket.io')(http);
// Socket IO Namespaces
var ioWeb = socket.of('/web');
var ioPi = socket.of('/pi');
/********* Express Routing *********/
app.use(express.static(__dirname));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/templates/local.html');
});
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/templates/login.html');
});
app.post('/admin', (req, res) => {
  console.log(req.body);
  res.sendFile(__dirname + '/templates/admin.html');
});
app.get('/logout', (req, res) => {
  res.redirect('/');
})
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