var request = require('sync-request')
var fs = require('fs')

// import classes

var classes = require('./classes.js');
var Transaction = classes.Transaction;


module.exports = {

	blockchain: function(blockchainFile)
	{
		// add code here that broadcasts the blockchain file
		var blockchain = fs.readFileSync(blockchainFile).toString()
		var res = request('POST', 'http://stamps.vojtadrmota.com:80/blockchain.php', {
			headers: {       
    			'content-type': 'application/x-www-form-urlencoded'
  			},
			body: "blockchain="+blockchain
		})
		console.log("Broadcasting blockchain...")
	},

	mempool: function(mempoolFile)
	{
		// add code here that broadcasts new mempool
		var mempool = fs.readFileSync(mempoolFile).toString()
		var res = request('POST', 'http://stamps.vojtadrmota.com:80/mempool.php', {
			headers: {       
    			'content-type': 'application/x-www-form-urlencoded'
  			},
			body: "mempool="+mempool
		})
		console.log("Broadcasting mempool...")
	},

	transaction: function(type, from, to, stamp, signature, origin, timestamp, mempoolFile)
	{
		// right now this broadcasts to local mempool, but it should broadcast to actual mempool in the future
		var transaction = new Transaction(type, from, to, stamp, signature, origin, timestamp)
		var current = fs.readFileSync(mempoolFile)
		if (current != "")
		{
			current = JSON.parse(current)
			current.push(transaction)
		}
		else
		{
			current = [JSON.stringify(transaction)]
		}
		fs.writeFileSync(mempoolFile, JSON.stringify(current))
	}
}