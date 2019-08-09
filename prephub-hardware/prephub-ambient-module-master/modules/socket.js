// Experimentally listen for socket connection and toggle mode accordingly

const http = require('http').createServer();
const io = require('socket.io')(http);

http.listen(80);
console.log('Listening for socket connections on port 80');

io.on('connection', (socket) => {
    console.log('Socket connection received');
    socket.on('prephub', (data) => {
        console.log('PREPHub mode: ' + data.mode);
        // TODO toggle(data.mode);
    });
});
