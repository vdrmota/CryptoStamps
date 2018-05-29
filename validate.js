var bitcoin = require('bitcoinjs-lib')
var bitcoinMessage = require('bitcoinjs-message')
var CoinKey = require('coinkey')
var imageHash = require('hasha')

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

  return 
  {
    compressed: !!(flagByte & 4),
    recovery: flagByte & 3,
    signature: buffer.slice(1)
  }
}

/*
	Validating a transaction
*/

function transaction (transaction)
{
	// ensure that signature is a buffer

	signature = Buffer.from(transaction.signature, 'base64')
	if(!signature instanceof Buffer)
		return false
	if(!decodeSignature(signature))
		return false

	// find origin on blockchain

	if (!blockchain.find(blockchainFile, transaction.origin, transaction.from))
		return false

	// check if stamp index was calculated correctly

	if (helpers.findNumFromHash(transaction.origin, totalStamps) != transaction.stamp)
		return false

	// check if signature is valid
	
	var filename = helpers.getStamp(transaction.stamp, stamps, stampsDir);
	var data = imageHash(filename);
	var signatureBuffer = new Buffer(transaction.signature, 'base64'); // because signature comparison is in binary code
	if (!bitcoinMessage.verify(data, transaction.from, signatureBuffer))
		return false

	return true // if transaction passed the checks
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


console.log(transaction(JSON.parse('[{"type":"coinbase","from":"17xY4nkJxkiXvNa3a21mkpNfFo5jMEzm1P","to":"","stamp":0,"signature":"G1nz8vXVeosibJmhop0ShwfpVdzXpFGj0OVLJaUmUMBVChzf+0O9bnRgUw6AgCVBlzBEIQTR+mt5Fs9hGp5ykUo=","origin":"000075e28e80aa19c10f33fe8a4bfedbe6b3082e56f77415ae80d5445e5c0bfa3087423e6cc1babc89c4145ab207c6d9e39b6f4f3ae5224fb25760d176c3a44c","timestamp":1527508352364}]')[0]))


