
var express = require('express');
var app = express(); // Need this line to call express functions
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser'); // Need this to parse body of a request


// Namespaces
var ioWeb = io.of('/user');
var ioPi = io.of('/pi');

/********* Express Routing *********/
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());


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

/********* Socket.io *********/

/*** 
 * Handles communication of messages between a socket
 * within the ioWeb ('/user') namespace
 */
ioWeb.on('connection', (socket) => {
    console.log('a web user has connected');

    socket.on('send command', (data) => {
        console.log("Received command from user");
        console.log(data);
        ioWeb.emit('send command confirm', 'Command received from server');
        ioPi.emit('send command', data);
    });
});

// Pi stuff
ioPi.on('connection', (socket) => {
    console.log('a pi has connected');
});

server.listen(process.env.PORT || 8080, console.log('Ready at http://localhost:8080/'));