var bitcoin = require('bitcoinjs-lib')
var bitcoinMessage = require('bitcoinjs-message')
var CoinKey = require('coinkey')
var imageHash = require('hasha')
var colors = require('colors/safe')

var blockchain = require('./blockchain.js')
var helpers = require('./functions.js')
var mempool = require('./mempool.js')

const blockchainFile = "blockchain.txt"
const remoteBlockchainFile = "remoteBlockchain.txt"
const stampsDir = "./stamps/"
const stamps = helpers.listStamps(stampsDir)
const totalStamps = stamps.length
const updateInterval = 10000 
const difficulty = 4

function decodeSignature (buffer) 
{
  if (buffer.length !== 65) return false

  var flagByte = buffer.readUInt8(0) - 27
  if (flagByte > 7) return false

  return buffer.slice(1)
}

/*
	Validating a transaction
*/

function transaction (transaction)
{
	// check that transaction has all components
	if (!mempool.transactionStructure(transaction))
		return false

	// validation for coinbase transactions
	if (transaction.type == "coinbase")
	{
		try // since there is some dependency on libraries; to prevent crash
		{ 

		// check if this reward has already been retrieved
		if (blockchain.findReward(blockchainFile, transaction.origin))
			return false
		
		// ensure that signature is a buffer

		var signature = Buffer.from(transaction.signature, 'base64')
		if(!signature instanceof Buffer)
			return false
		if(!decodeSignature(signature))
			return false

		// find origin hash on blockchain, checking if the block was mined by node asking for reward

		if (!blockchain.findHash(blockchainFile, transaction.origin, transaction.from))
			return false

		// check if stamp index was calculated correctly

		if (helpers.findNumFromHash(transaction.origin, totalStamps) != transaction.stamp)
			return false

		//check if signature is valid
		
		var filename = helpers.getStamp(transaction.stamp, stamps, stampsDir)
		var data = imageHash(filename)
		var signatureBuffer = new Buffer(transaction.signature, 'base64') // because signature comparison is in binary code
		if (!bitcoinMessage.verify(data, transaction.from, signatureBuffer))
			return false

		console.log("Transaction "+transaction.signature+" is "+colors.green("valid")+".")
		return true // transaction is valid
		
		}
		catch (err)
		{
			return false
		}
	}
}

/*
	 Validating a block
*/

function block (block)
{

	// check if block structure is valid

	// check if signature is valid

	// check if payload in block is valid

}

/*
	 Validating a blockchain
*/

var localChain = blockchain.read(blockchainFile, difficulty, updateInterval, false)
var remoteChain = blockchain.read(remoteBlockchainFile, difficulty, updateInterval, false)

// check if local blockchain state is valid
if (!localChain.validateChain())
	console.log("chian not valid")

// check if received blockchain state is valid
if (!remoteChain.validateChain())
	console.log("remote chain not valid")

// find which chain has more work i.e. is more true
var workDiff = remoteChain.calculateWork() - localChain.calculateWork()
if (workDiff < 1)
	console.log("remote chain doesn't have more work") // remote chain doens't have more work

// find which blocks local state is missing -> these need to be validated
var newBlocks = blockchain.blocksDiff(localChain, remoteChain)

// iterate through the new blocks -> check if each is valid
for (var i = 0, n = newBlocks.length; i < n; i++)
{
	if (!block(newBlocks[i]))
		console.log("block is not valid")
}

// if remote chain has more work, is valid, and all its blocks are valid -> adopt it locally



//console.log(transaction(JSON.parse('[{"type":"coinbase","from":"17xY4nkJxkiXvNa3a21mkpNfFo5jMEzm1P","to":"","stamp":1,"signature":"HNhl3HHj7tXTYhqQjITFfJDnycMkmCbnPfYAIVZGdkvjOyYdDbSgNQrUgKJVZGYRdj5sDEEmVrSebwvwIHSRCZk=","origin":"000033c1cf55bd4362634f264af96a58809b2ab1f3da161be7f6a7d2c2cc5a8179d5095be2d64f900b8e586eb98ada5a451e109a1edb9c4aba2fc8fd656a0b13","timestamp":1527596476178}]')[0]))
