//client.js
var io = require('socket.io-client');
var socket = io.connect('http://vojtadrmota.com:1337', {reconnect: true});

exports.io = io
exports.socket = socket

/*
// Add a connect listener
socket.on('connect', function (socket) {
    console.log('Connected!');
});
socket.emit('CH01', 'me', 'test msg');
*/