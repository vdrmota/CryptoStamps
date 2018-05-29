// import functions

var helpers = require('./functions.js');
var colors = require('colors/safe')
var fs = require('fs');

// load classes

var classes = require('./classes.js');
var Block = classes.Block;
var LoadBlock = classes.LoadBlock;
var LoadBlockchain = classes.LoadBlockchain;

module.exports = {

  // downloads blockchain

  refresh: function() {
		// define mempool location and output file

		const blockchainUrl = "http://stamps.vojtadrmota.com/blockchain.txt"
		const blockchainFile = "blockchain.txt"

		// retrieve/update local mempool from server; periodically update blockchain

		helpers.getUrlContents(blockchainUrl, blockchainFile)
  },

  // updates local state of blockchain

  read: function (blockchainFile, difficulty, interval) {

		console.log("Loading blockchain...")

		var blockchain = fs.readFileSync(blockchainFile).toString()

		contents = JSON.parse(blockchain)

		// load blockchain from text file including the genesis block

		let newChain = new LoadBlockchain(difficulty, interval, contents.chain[0].timestamp, contents.chain[0].issuer, contents.chain[0].signature, contents.chain[0].hash, contents.chain[0].nonce);

		// load all already-mined blocks from text file into blockchain

		var l = contents.chain.length;

		for (var i = 1; i < l; i++) 
		{
		    newChain.oldBlock(new LoadBlock(contents.chain[i].index, contents.chain[i].timestamp, contents.chain[i].data, contents.chain[i].issuer, contents.chain[i].signature, contents.chain[i].hash, contents.chain[i].nonce));
		    console.log("Loading block " + i + "...")
		}

		console.log(colors.green("Successfully loaded " + (l-1) + " blocks"))

		return newChain

  },

  // looks for a hash and check if it was sent by same person, returns true if found, false if not found

  find: function (blockchainFile, hash, sender)
  {
  		var blockchain = JSON.parse(fs.readFileSync(blockchainFile).toString()).chain
  		for (var i = 0, n = blockchain.length; i < n; i++)
  		{
  			if (blockchain[i].hash == hash && blockchain[i].issuer == sender)
  			{
  				return true
  			}
  		}

  		return false
  }

}