'use strict'
var express = require('express');
var app = express();
var server = app.listen(9000);
//var http = require('http').Server(app);
var socket = require('socket.io').listen(server); //Communication between server/webpage and server/pi
var request = require('request'); //To fetch RSS feed data
var xml2js = require('xml2js'); //To parse RSS feed XML data
var rssURL = 'http://rss.blackboardconnect.com/239300/PSUAlert/feed.xml'; //URL of RSS feed
var lightingUnlockTime = 0; //Integer in milliseconds when lighting lock will release
var radioUnlockTime = 0; //Integer in milliseconds when radio lock will release
var lightingLockTime = 10000; //How long should the lights be locked after change
var radioLockTime = 10000; //How long should the radio be locked after change
var rssInterval = 5000; //How often should RSS feed be checked
var rssData = [{}]; //Parsed RSS data will be stored here in fields: 'description', 'date'
var lastRSSMsg = "";//Last RSS message sent to Pi/Webpage
var rssRelevantWindow = 43200000; //Ignore RSS feeds older than this (12 hours)
var index = 0; //For demo purposes, index will cycle through example RSS URLs
var demo = true;//Enable/disable demo mode
var os = require('os');
var router = express.Router();

if(demo === true){
  rssRelevantWindow = 1000000000*1000;//Sets very large time window for RSS testing purposes
} 
else {
  rssRelevantWindow = 43200000; //Sets 12 hour time window for RSS parser
}

//Function will automatically run every $rssInterval seconds to fetch and parse RSS feed data
setInterval(() => {
  console.log("getting RSS data! -- " + index);

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
        sendData(true);
        return;
      }
      //Extract relevant info from body string and push to rssData array
      for (let i = 0; i < result.rss.channel[0].item.length; i++) {
        rssData.push({
          'description': result.rss.channel[0].item[i].description[0],
          'date': result.rss.channel[0].item[i].pubDate[0]
        });
      }
      sendData(false);
    });
  });
}
  , rssInterval);
//Send RSS feed data to webpage & Pi
function sendData(empty_flag) {
  //Check if there are entries in the RSS feed array
  if (rssData.length > 1) {
    let rssTime = (new Date(rssData[1].date).getTime());
    let nowTime = (new Date().getTime());
    //Check how recent the latest RSS feed is. Will not send feed posts older
    //than $rssRelevantWindow milliseconds
    if ((nowTime - rssTime) < rssRelevantWindow) {
      console.log(rssData[1]);
	
      if(rssData[1].description !== lastRSSMsg){
        //Send RSS data to Pi
        lastRSSMsg = rssData[1].description;
        
	if(rssData[1].description.includes("inclement weather")){
          ioPi.emit('rss feed', "inclement weather");
        }
        else if(rssData[1].description.includes("Police activity")){
          ioPi.emit('rss feed', "police");
        }
        else if(rssData[1].description.includes("remains open")){
          ioPi.emit('rss feed', "all clear");
        } 
        //^Send RSS data to Pi^
        ioWeb.emit('rss feed', rssData[1]);
        console.log('sending rss feed');
      }
    }
    else {
      console.log("rss data too old, not sending");
    }
  }
  //If no entries in RSS feed array, send all clear message
  else {
    if(lastRSSMsg !== "empty"){
      lastRSSMsg = "empty";
      ioWeb.emit('rss feed', "rss feed clear");
    }
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
  res.sendFile(__dirname + '/rss_police_clear.xml');
});
app.get('/setrsspolice', (req, res) => {
  rssURL = 'http://35.197.44.95:9000/rss_feed_samples/rss_police.xml';
  res.send('rss feed changed to: ' + rssURL);
});
app.get('/setrssclear', (req, res) => {
  rssURL = 'http://35.197.44.95:9000/rss_feed_samples/rss_police_clear.xml';
  res.send('rss feed changed to: ' + rssURL);
});
app.get('/setrssdefault', (req, res) => {
  rssURL = 'http://rss.blackboardconnect.com/239300/PSUAlert/feed.xml';
  res.send('rss feed changed to: ' + rssURL);
});
app.use(express.static('templates'));
app.use('/images', express.static('templates'));
app.use('/', router);
express.static('/templates/images/', router);



/********* Socket.io Stuff *********/
//* web namespace */
ioWeb.on('connection', function (socket) {
  //Send RSS data to user on connection to server if any is currently being stored
  //sendData();
  
  if(rssData.length > 1){
    socket.emit('rss feed', rssData[1]);
  }
  else {
    socket.emit('rss feed', 'rss feed clear');
  }
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
