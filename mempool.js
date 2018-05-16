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
		// add code here that removes transaction from local mempool
		var data = JSON.parse(fs.readFileSync(memPoolFile))
		data.splice(transactionIndex, 1)
		fs.writeFileSync(memPoolFile, JSON.stringify(data))
	},

	exists: function (transaction) {
		return fs.readFileSync(memPoolFile).toString().indexOf(transaction) > -1
	},

	read: function (filename) {

		var mempool = fs.readFileSync(filename).toString()

		// empty string renders syntax error in JSON
		if (mempool != "")
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
	}
}