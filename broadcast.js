var request = require('sync-request')
var fs = require('fs')

// import classes

var classes = require('./classes.js');
var Transaction = classes.Transaction;

const mempoolFile = "mempool.txt"


module.exports = {

	// broadcasts the blockchain to the relay server

	blockchain: function(blockchainFile)
	{
		var blockchain = fs.readFileSync(blockchainFile).toString()
		blockchain = blockchain.replace(/\+/g, "%2B"); 
		var res = request('POST', 'http://stamps.vojtadrmota.com:80/blockchain.php', {
			headers: {       
    			'content-type': 'application/x-www-form-urlencoded'
  			},
			body: "blockchain="+encodeURIComponent(blockchain)
		})
		console.log("Broadcasting blockchain...")
	},

	// broadcasts the transaction to the relay server

	transaction: function(type, from, to, stamp, signature, origin, timestamp, mempoolFile)
	{
		
		signature = signature.replace(/\+/g, "%2B")
		origin = origin.replace(/\+/g, "%2B")
		var transaction = JSON.stringify(new Transaction(type, from, to, stamp, signature, origin, timestamp))
		var res = request('POST', 'http://stamps.vojtadrmota.com:80/transaction.php', {
			headers: {       
    			'content-type': 'application/x-www-form-urlencoded'
  			},
			body: "transaction="+encodeURIComponent(transaction)
		})
		console.log("Broadcasting transaction...")
	}
}