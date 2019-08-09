'use strict'
var express = require('express');
var app = express();
var http = require('http').Server(app);
var socket = require('socket.io')(http);

var lightingUnlockTime = 0; //Integer in milliseconds when lighting lock will release
var radioUnlockTime = 0; //Integer in milliseconds when radio lock will release
var lightingLockTime = 10000; //How long should the lights be locked after change
var radioLockTime = 10000; //How long should the radio be locked after change

// Socket IO Namespaces
var ioWeb = socket.of('/web');
var ioPi = socket.of('/pi');
/********* Express Routing *********/
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/templates/local.html');
});

/********* Socket.io Stuff *********/
//* web namespace */
ioWeb.on('connection', function(socket){
    console.log("a web user has connected.");
    socket.on('send command', function(data){
      console.log('command received');

      //Lighting lock check
      if(data['command'] === 'Change Light'){
        if(Date.now() >= lightingUnlockTime){
          lightingUnlockTime = Date.now()+10000;
          ioPi.emit('send command', data);
        }
        else{
          console.log('lighting is currently locked');
        }
      }
      //Radio lock check
      if(data['command'] === 'Change Radio'){
        if(Date.now() >= radioUnlockTime){
          radioUnlockTime = Date.now()+10000;
          ioPi.emit('send command', data);
        }
        else{
          console.log('radio is currently locked');
        }
      }

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