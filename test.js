/*var bitcoin = require('bitcoinjs-lib')
var bitcoinMessage = require('bitcoinjs-message')
var CoinKey = require('coinkey')
var imageHash = require('hasha')

var helpers = require('./functions.js')

sign.sign("0000d212cbf4835de054700e66b47c44eca20a104f1fd9aa4f51d8054f9fb5a97cdbd50c6151f648d64ec4d9ba5e788468a6bbb6990cbf32ae79ca87d74ee9d8")

var retrieveCredentials = helpers.getCredentials("credentials.txt")
var privateKey = retrieveCredentials.privateKey
var key = new CoinKey(new Buffer(privateKey, 'hex'))
key.compressed = false

var keyPair = bitcoin.ECPair.fromWIF(key.privateWif)
var privateKey = keyPair.d.toBuffer(32)
var message = imageHash('./stamps/messi.png')

var signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed).toString('base64')
var buf = new Buffer(signature, 'base64');

console.log(signature)

var address = "17xY4nkJxkiXvNa3a21mkpNfFo5jMEzm1P"
var signature = buf

//console.log(message)

console.log(bitcoinMessage.verify(message, address, buf))*/

var sign = require('./sign.js')
sign.sign("0000d212cbf4835de054700e66b47c44eca20a104f1fd9aa4f51d8054f9fb5a97cdbd50c6151f648d64ec4d9ba5e788468a6bbb6990cbf32ae79ca87d74ee9d8")