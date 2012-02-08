/*jslint white: true, devel: true, onevar: false, undef: true, nomen: false,
  regexp: true, plusplus: false, bitwise: true, newcap: true, maxerr: 50,
  indent: 4 */
/*global require: false, __dirname: false */

var express = require('express');
var sio = require('socket.io');

var app = express.createServer();
var io = sio.listen(app);

app.listen(8080);

app.get('/', function (req, res) {
    console.log('fetch root');
    res.sendfile(__dirname + '/chat.html');
});

app.get('/chat.js', function (req, res) {
    console.log('fetch chat.js');
    res.sendfile(__dirname + '/chat.js');
});

io.sockets.on('connection', function (socket) {
    console.log('socket connected');
    socket.on('message', function (msg) {
        console.log('received chat message: ' + msg);
        socket.broadcast.send(msg);
    });
    socket.on('disconnect', function () {
        console.log('socket disconnected');
    });
});
