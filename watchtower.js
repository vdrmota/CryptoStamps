var io = require('socket.io-client');
var fs = require('fs')
var socket = io.connect('http://vojtadrmota.com:1337', {reconnect: true});
var validate = require('./validate.js')
//var miner = require('./miner.js')
var mempool = require('./mempool.js')

const blockchainFile = "blockchain.txt"
const remoteBlockchainFile = "remoteBlockchain.txt"
const mempoolFile = "mempool.txt"

socket.on('receive_blockchain', function (blockchain) 
{
    fs.writeFileSync(remoteBlockchainFile, blockchain)
    var validateChain = validate.chain(blockchainFile, remoteBlockchainFile)
    // log result of validation
    console.log(validateChain.message)
    // if validation was successful -> make remote chain local
    if (validateChain.res)
    {
    	fs.writeFileSync(blockchainFile, blockchain)
    	//miner.updateChain()

    	// remove origin transaction from local mempool
    }
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