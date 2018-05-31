var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function (socket){

	console.log('New connection.');

	// when receiving an updated blockchain, emit it to all nodes
	socket.on('emit_blockchain', function (blockchain) {
		// emit to all nodes
		io.sockets.emit('receive_blockchain', blockchain)
		console.log("Emitting new state of blockchain...")
	});

});

http.listen(1337, function () {
  console.log('listening on *:1337');
});
