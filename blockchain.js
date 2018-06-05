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

  read: function (blockchainFile, difficulty, interval, verbose) {

  	if (verbose)
			console.log("Loading blockchain...")

		var blockchain = fs.readFileSync(blockchainFile).toString()

		contents = JSON.parse(blockchain)

		// load blockchain from text file including the genesis block

		let newChain = new LoadBlockchain(difficulty, interval, contents.chain[0].timestamp, contents.chain[0].issuer, contents.chain[0].signature, contents.chain[0].hash, contents.chain[0].nonce);

		// load all already-mined blocks from text file into blockchain

		var l = contents.chain.length;

		for (var i = 1; i < l; i++) 
		{
		    newChain.oldBlock(new LoadBlock(contents.chain[i].height, contents.chain[i].timestamp, contents.chain[i].payload, contents.chain[i].issuer, contents.chain[i].signature, contents.chain[i].hash, contents.chain[i].nonce, contents.chain[i].previousHash));
		    if (verbose)	
		    	console.log("Loading block " + i + "...")
		}

		if (verbose)
			console.log(colors.green("Successfully loaded " + (l-1) + " blocks"))

		return newChain

  },

  // looks for a hash and check if it was sent by same person, returns true if found, false if not found

  findHash: function (blockchainFile, hash, sender)
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
  },

  // looks if the reward origin already exists in a payload on the blockchain
  // returns true if the reward has already been retrieved; false if not


  findReward: function (blockchainFile, origin)
  {
  		var blockchain = JSON.parse(fs.readFileSync(blockchainFile).toString()).chain
  		for (var i = 0, n = blockchain.length; i < n; i++)
  		{
  			if (blockchain[i].payload.origin == origin)
  			{
  				return true
  			}
  		}

  		return false
  },

  // iterates through the blocks in two chains and returns any blocks that are missing in first chain
  // returns an array

  blocksDiff: function (localChain, remoteChain)
  {
  		var chain = remoteChain.chain
  		var localChainLength = localChain.chain.length
  		var newBlocks = []
  		for (var i = 1, n = chain.length; i < n; i++)
        {
        	// check all the way to the end of local chain
        	if (localChainLength > i)
        	{
	        	// check if this hash is at the same index in local chain
	        	if (chain[i].hash == localChain.chain[i].hash)
	        		continue
	        	else 
	        		newBlocks.push(chain[i])
        	}
        	else
        	{
        		newBlocks.push(chain[i])
        	}
        }
        return newBlocks
  }
}