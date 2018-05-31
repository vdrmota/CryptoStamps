var io = require('socket.io-client');
var socket = io.connect('http://vojtadrmota.com:1337', {reconnect: true});

socket.on('receive_blockchain', function (blockchain) {
    console.log(blockchain);
});

// receive mempool transactions when someone else has retrieved a reward and broadcasted it

// receive new blockchains when someone has mined a block and broadcasted it -> remove these from mempool if valid

// update local blockchain