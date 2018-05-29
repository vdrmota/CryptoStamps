var bitcoin = require('bitcoinjs-lib')
var bitcoinMessage = require('bitcoinjs-message')
var CoinKey = require('coinkey')
var imageHash = require('hasha')
var colors = require('colors/safe')

var blockchain = require('./blockchain.js')
var helpers = require('./functions.js')

const blockchainFile = "blockchain.txt"
const stampsDir = "./stamps/"
const stamps = helpers.listStamps(stampsDir)
const totalStamps = stamps.length

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
	try { // since there is some dependency on libraries; to prevent crash

		// ensure that signature is a buffer

		var signature = Buffer.from(transaction.signature, 'base64')
		if(!signature instanceof Buffer)
			return false
		if(!decodeSignature(signature))
			return false

		//find origin on blockchain

		if (!blockchain.find(blockchainFile, transaction.origin, transaction.from))
			return false

		// check if stamp index was calculated correctly

		if (helpers.findNumFromHash(transaction.origin, totalStamps) != transaction.stamp)
			return false

		//check if signature is valid
		
		var filename = helpers.getStamp(transaction.stamp, stamps, stampsDir);
		var data = imageHash(filename);
		var signatureBuffer = new Buffer(transaction.signature, 'base64'); // because signature comparison is in binary code
		if (!bitcoinMessage.verify(data, transaction.from, signatureBuffer))
			return false

		console.log(colors.green("Transaction "+transaction.signature+" is valid."))
		return true // transaction is valid
	}
	catch (err)
	{
		return false
	}
}

// receive mined block to validate


// check that image signature is valid -- you have the data and the public key, so check if it was signed by correct private key

// validate block or deny it; make sure to check that miner didn't mine his own transaction

// check if previous hash is the same as you have; check that your blockchain is legal first.

// validate or deny reward; check if transaction has already been mined; by checking if this hash already exists

// broadcast decision

// remove transaction from mempool -- but if denied, add it back to mempool and broadcast these

// update state of blockchain

/*
	 Validating a block
*/

// check if block is valid

// append it to chain, see if chain is valid


transaction(JSON.parse('[{"type":"coinbase","from":"17xY4nkJxkiXvNa3a21mkpNfFo5jMEzm1P","to":"","stamp":1,"signature":"HNhl3HHj7tXTYhqQjITFfJDnycMkmCbnPfYAIVZGdkvjOyYdDbSgNQrUgKJVZGYRdj5sDEEmVrSebwvwIHSRCZk=","origin":"00001ebbc9c6b1127a6af68ac749e617fd79bc1c21539043e9637f3523c08cfde879f9281bed634624c1b4b7e480a72ef43f2d6df01a66e8c515db8cea7f5057","timestamp":1527593855804}]')[0])
