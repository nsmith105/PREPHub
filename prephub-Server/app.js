'use strict'
const express = require('express');
const app = express();
const http = require('http').Server(app);
const socket = require('socket.io')(http);
const bodyParser = require('body-parser'); // Need this to parse body of a request

let lightingTimeUnlock = 10000; //how long lights should be locked after being changed (in ms)
let radioTimeUnlock = 10000; //how long radio should be locked after being changed (in ms)
let lightingLock = false;
let radioLock = false;
//const lightingPresets = ["White", "Red", "Blue", "Green"];
//const radioPresets = ["Radio 1", "Radio 2", "Radio 3", "Radio 4"];

// Socket IO Namespaces
const ioWeb = socket.of('/web');
const ioPi = socket.of('/pi');
/********* Express Routing *********/
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: true
}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/templates/local.html');
});

app.post('/twitter', (req, res) => {
  let data = [];

  for(let i = 0; i < req.body['tweets'].length; i++){
    data.push({'text': req.body['tweets'][i]['text'], 'time': req.body['tweets'][i]['time']});
  }

  ioWeb.emit('twitter data', data);
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
/*** 
 * Handles communication of messages between a socket
 * within the ioWeb ('/web') namespace
 */
ioWeb.on('connection', function(socket){
    console.log("a web user has connected.");
    socket.on('send command', function(data){
      console.log('command received');

      if(data['command'] == 'Change Light'){
        if(lightingLock == false){
          lightingLock = true;
          ioPi.emit('send command', data);
          console.log("lights locked until: " + lightingTimeUnlock);
          setTimeout(()=> {
            lightingLock = false;
            console.log("lights unlocked");
          }, lightingTimeUnlock);
        }
        else{
          console.log("lighting cannot be changed again so soon");
        }
      }
      else if(data['command'] == 'Change Radio'){
        if(radioLock == false){
          radioLock = true;
          ioPi.emit('send command', data);
          console.log("radio locked until: " + radioTimeUnlock);
          setTimeout(()=> {
            radioLock = false;
            console.log("radio unlocked");
          }, radioTimeUnlock);
        }
        else{
          console.log("radio cannot be changed again so soon");
        }
      }
    });
});

/*
* Handles communications between the Raspberry Pi and server
* within the ioPi ('/pi') namespace
*/
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