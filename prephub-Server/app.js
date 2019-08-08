'use strict'
var express = require('express');
var app = express();
var http = require('http').Server(app);
var socket = require('socket.io')(http); //Communication between server/webpage and server/pi
var request = require('request'); //To fetch RSS feed data
var xml2js = require('xml2js'); //To parse RSS feed XML data

var rssURL = 'http://prephub-web.appspot.com/rss'; //URL of RSS feed
var lightingUnlockTime = 0; //Integer in milliseconds when lighting lock will release
var radioUnlockTime = 0; //Integer in milliseconds when radio lock will release
var lightingLockTime = 10000; //How long should the lights be locked after change
var radioLockTime = 10000; //How long should the radio be locked after change
var rssInterval = 3000; //How often should RSS feed be checked
var rssData = [{}]; //Parsed RSS data will be stored here in fields: 'description', 'date'

//Function will automatically run every $rssInterval seconds to fetch and parse RSS feed data
setInterval(() => {
  console.log("getting RSS data!");

  //Send HTTP request to get XML data from rssURL
  request(rssURL, (error, response, body) => {
    var parser = new xml2js.Parser();

    //Connection error handling
    try {
      if (error || response.statusCode != 200) {
        throw "Error connecting to RSS feed.";
      }
    } catch (err) {
      console.log(err);
      return;
    }

    //Parse XML data stored in body string
    parser.parseString(body, (err, result) => {
      //Extract relevant info from body string and push to rssData array
      for (let i = 0; i < result.rss.channel[0].item.length; i++) {
        rssData.push({
          'description': result.rss.channel[0].item[i].description[0],
          'date': result.rss.channel[0].item[i].pubDate[0]
        });
      }
      sendData();
    });
  });

}
  , rssInterval);

//Scan RSS feed for keywords. e.g. 'Police', 'Snow', etc and then act on them
function sendData() {
  console.log(rssData[1].date);

  console.log(new Date(rssData[1].date).getTime());

  //if (rssData[2].description === 'PSU Alert: Police activity near the corner of 6th and Montgomery. Avoid the area.')
  //  console.log("Police!");
}

// Socket IO Namespaces
var ioWeb = socket.of('/web');
var ioPi = socket.of('/pi');
/********* Express Routing *********/
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/templates/local.html');
});

app.get('/rss', (req, res) => {
  res.sendFile(__dirname + '/psufeed.xml')
});

/********* Socket.io Stuff *********/
//* web namespace */
ioWeb.on('connection', function (socket) {
  console.log("a web user has connected.");
  socket.on('send command', function (data) {
    console.log('command received');

    //Lighting lock check
    if (data['command'] === 'Change Light') {
      if (Date.now() >= lightingUnlockTime) {
        lightingUnlockTime = Date.now() + 10000;
        ioPi.emit('send command', data);
      }
      else {
        console.log('lighting is currently locked');
      }
    }
    //Radio lock check
    if (data['command'] === 'Change Radio') {
      if (Date.now() >= radioUnlockTime) {
        radioUnlockTime = Date.now() + 10000;
        ioPi.emit('send command', data);
      }
      else {
        console.log('radio is currently locked');
      }
    }

  });
});
/* pi namespace */
ioPi.on('connection', function (socket) {
  console.log("a pi user has connected.");
  socket.on('send command confirm', function (msg) {
    console.log("command confirmation received from Pi");
    ioWeb.emit('send command confirm', msg);
  });
});
let port = process.env.PORT || 8080;
http.listen(port, function () {
  console.log('listening on: ' + port);
});