'use strict'
var express = require('express');
var app = express();
var http = require('http').Server(app);
var socket = require('socket.io')(http); //Communication between server/webpage and server/pi
var request = require('request'); //To fetch RSS feed data
var xml2js = require('xml2js'); //To parse RSS feed XML data

var rssURL = 'http://rss.blackboardconnect.com/239300/PSUAlert/feed.xml'; //URL of RSS feed
var lightingUnlockTime = 0; //Integer in milliseconds when lighting lock will release
var radioUnlockTime = 0; //Integer in milliseconds when radio lock will release
var lightingLockTime = 10000; //How long should the lights be locked after change
var radioLockTime = 10000; //How long should the radio be locked after change
var rssInterval = 30000; //How often should RSS feed be checked
var rssData = [{}]; //Parsed RSS data will be stored here in fields: 'description', 'date'
var rssRelevantWindow = 43200000; //Ignore RSS feeds older than this

var index = 0; //For demo purposes, index will cycle through example RSS URLs
var demo = false;//Enable/disable demo mode

//Function will automatically run every $rssInterval seconds to fetch and parse RSS feed data
setInterval(() => {
  console.log("getting RSS data! -- " + index);

  //Demo for testing RSS cases
  if (demo === true) {
    switch (index) {
      case 0:
        rssURL = 'http://prephub-web.appspot.com/rss_empty';
        break;
      case 1:
        rssURL = 'http://prephub-web.appspot.com/rss_police';
        break;
      case 2:
        rssURL = 'http://prephub-web.appspot.com/rss_police_clear';
        break;
    }
    index++;
    if (index === 3) {
      index = 0;
    }
  }

  //Demo for testing RSS cases

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

      //Remove all old RSS entries from list before checking for new ones
      for (let i = rssData.length - 1; i > 0; i--)
        rssData.pop();

      //The RSS feed is empty
      if (!result.rss.channel[0].item) {
        sendData();
        return;
      }

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

//Send RSS feed data to webpage & Pi
function sendData() {
  //Check if there are entries in the RSS feed array
  if (rssData.length > 1) {
    let rssTime = (new Date(rssData[1].date).getTime());
    let nowTime = (new Date().getTime());
    //Check how recent the latest RSS feed is. Will not send feed posts older
    //than $rssRelevantWindow milliseconds
    if ((nowTime - rssTime) < rssRelevantWindow) {
      console.log(rssData[1]);
      ioWeb.emit('rss feed', rssData[1]);
      console.log('sending rss feed');
    }
    else {
      console.log("rss data too old, not sending");
    }
  }
  //If no entries in RSS feed array, send all clear message
  else {
    ioWeb.emit('rss feed', "rss feed clear");
  }
}

// Socket IO Namespaces
var ioWeb = socket.of('/web');
var ioPi = socket.of('/pi');
/********* Express Routing *********/
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/templates/local.html');
});

app.get('/rss_empty', (req, res) => {
  res.sendFile(__dirname + '/rss_empty.xml')
});

app.get('/rss_police', (req, res) => {
  res.sendFile(__dirname + '/rss_police.xml')
});

app.get('/rss_police_clear', (req, res) => {
  res.sendFile(__dirname + '/rss_police_clear.xml')
});

/********* Socket.io Stuff *********/
//* web namespace */
ioWeb.on('connection', function (socket) {
  //Send RSS data to user on connection to server if any is currently being stored
  sendData();

  console.log("a web user has connected.");
  socket.on('send command', function (data) {
    console.log('command received');

    //Lighting lock check
    if (data['command'] === 'Change Light') {
      if (Date.now() >= lightingUnlockTime) {
        lightingUnlockTime = Date.now() + lightingLockTime;
        ioPi.emit('send command', data);
      }
      else {
        console.log('lighting is currently locked');
      }
    }
    //Radio lock check
    if (data['command'] === 'Change Radio') {
      if (Date.now() >= radioUnlockTime) {
        radioUnlockTime = Date.now() + radioLockTime;
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