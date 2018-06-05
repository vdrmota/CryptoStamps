// import functions

var helpers = require('./functions.js');


// import modules
var fs = require('fs');

const memPoolUrl = "http://stamps.vojtadrmota.com/mempool.txt"
const memPoolFile = "mempool.txt"

module.exports = {

    refresh: function () {
		helpers.getUrlContents(memPoolUrl, memPoolFile)
	},

	remove: function (transactionIndex) {
		var data = JSON.parse(fs.readFileSync(memPoolFile))
		data.splice(transactionIndex, 1)
		fs.writeFileSync(memPoolFile, JSON.stringify(data))
	},

	exists: function (transaction) {
		try
		{
			var data = JSON.parse(fs.readFileSync(memPoolFile))
		}
		catch (err)
		{
			return false // if mempool is empty
		}
		for (var i = 0, n = data.length; i < n; i++)
		{
			if (data[i].origin == transaction.origin)
				return true
		}
		return false
	},

	read: function (filename) {

		var mempool = fs.readFileSync(filename).toString()

		// empty string renders syntax error in JSON
		if (mempool != "" && mempool != "[]")
			return JSON.parse(mempool)
		else
			return false
	},

	random: function(data) {
		var max = data.length - 1
		var min = 0
		var randomIndex = Math.floor(Math.random() * (max - min + 1)) + min

		// select random transaction from mempool
		return [data[randomIndex], randomIndex]
	},

	// checks if all the components of a transaction are there

	transactionStructure: function (transaction) {
		// type
		if ((typeof transaction.type) === 'undefined')
			return { "res": false, "message": "Error: Missing type."}
		// from
		if ((typeof transaction.from) === 'undefined')
			return { "res": false, "message": "Error: Missing from."}
		// to
		if ((typeof transaction.to) === 'undefined')
			return { "res": false, "message": "Error: Missing to."}
		// stamp
		if ((typeof transaction.stamp) === 'undefined')
			return { "res": false, "message": "Error: Missing stamp."}
		// signature
		if ((typeof transaction.signature) === 'undefined')
			return { "res": false, "message": "Error: Missing signature."}
		// origin
		if ((typeof transaction.origin) === 'undefined')
			return { "res": false, "message": "Error: Missing origin."}
		// timestamp
		if ((typeof transaction.timestamp) === 'undefined')
			return { "res": false, "message": "Error: Missing timestamp."}
		
		return { "res": true, "message": "Success."} // transaction structure exists
	},

	// adds a transaction to the local mempool file

	writeTransaction: function (transaction)
	{
		var current = fs.readFileSync(memPoolFile)
		if (current != "")
		{
			current = JSON.parse(current)
			current.push(transaction)
		}
		else
		{
			current = [JSON.stringify(transaction)]
		}
		fs.writeFileSync(memPoolFile, JSON.stringify(current).replace(/\\/g, '').replace('[""', '[').replace('""]', ']').replace('"{', '{').replace('}"', '}'))
	},

	removeBlock: function (origin)
	{
		var data = module.exports.read(memPoolFile)
		// if mempool file is empty -> don't do anything
		if (!data)
			return false
		// else -> remove mempool transactions that have been mined
		for (var i = 0, n = data.length; i < n; i++)
		{
			if (data[i].origin == origin)
			{
				data.splice(i)
				n-- // mempool shrinks with every deletion
			}
		}
		fs.writeFileSync(memPoolFile, JSON.stringify(data))
	}
}