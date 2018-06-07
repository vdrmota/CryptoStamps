var io = require('socket.io-client');
var fs = require('fs')
var socket = io.connect('http://vojtadrmota.com:1337', {reconnect: true});
var validate = require('./validate.js')
var mempool = require('./mempool.js')
var blockchain = require('./blockchain.js')

const blockchainFile = "blockchain.txt"
const remoteBlockchainFile = "remoteBlockchain.txt"
const mempoolFile = "mempool.txt"
const difficulty = 4
const updateInterval = 10000

socket.on('receive_blockchain', function (blockchain) 
{
    fs.writeFileSync(remoteBlockchainFile, blockchain)
    var validateChain = validate.chain(blockchainFile, remoteBlockchainFile)
    // log result of validation
    console.log(validateChain.message)
    // if validation was successful -> make remote chain local
    // also removes local mempool transactions that have been already mined
    if (validateChain.res)
        // write transaction to local blockchain
    	fs.writeFileSync(blockchainFile, blockchain)
})

socket.on('receive_transaction', function (transaction) 
{
	var validateTransaction = validate.transaction(JSON.parse(transaction), blockchainFile, true, true)
	// log the result of validation
	console.log(validateTransaction.message)
	if (validateTransaction.res)
		// write transaction to local mempool
		mempool.writeTransaction(transaction)
})