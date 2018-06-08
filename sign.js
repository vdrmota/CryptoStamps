// import modules

var imageHash = require('hasha')
var bitcoin = require('bitcoinjs-lib')
var bitcoinMessage = require('bitcoinjs-message')
var CoinKey = require('coinkey')
var exec = require('child_process').exec
var colors = require('colors/safe')
var config = require('./config.js')

// import functions

var helpers = require('./functions.js');
var broadcast = require('./broadcast.js')

// define constants

const credentialsFile = config.credentialsFile
const stampsDir = config.stampsDir
const stamps = config.stamps // this holds a list of all possible stamps
const totalStamps = stamps.length
const mempoolFile = config.mempoolFile

module.exports = {

	sign: function (hash)
	{

		// hash should be the hash of the block that was just mined

		var number = helpers.findNumFromHash(hash, totalStamps) // calculate this based on the hash
		var filename = helpers.getStamp(number, stamps, stampsDir); // retrieves filename

		// retrieve the hash of the file (this will be the signed data)

		var message = imageHash(filename)

		// retrieve private key

		var retrieveCredentials = helpers.getCredentials(credentialsFile)
		var privateKey = retrieveCredentials.privateKey
		var publicKey = retrieveCredentials.publicKey
		var key = new CoinKey(new Buffer(privateKey, 'hex'))
		key.compressed = false

		var keyPair = bitcoin.ECPair.fromWIF(key.privateWif)
		var privateKey = keyPair.d.toBuffer(32)

		var signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed).toString('base64')

		console.log("Signature: "+colors.cyan(signature))

		// save signature as comment metadata into file

		var save = 'exiftool -overwrite_original -comment="'+signature+'" '+filename;

		exec(save)

		console.log(colors.green("Successfully signed ")+colors.black(filename)+".")

		// define timestamp
		var timestamp = Date.now()

		// upload transaction to mempool
		broadcast.transaction("coinbase", publicKey, "", number, signature, hash, timestamp, mempoolFile)

		console.log(colors.green("Successfully broadcasted to mempool."))

		console.log("Transaction awaiting to be mined.")

	}
}