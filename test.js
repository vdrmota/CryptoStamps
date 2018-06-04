var validate = require('./validate.js')

console.log(validate.chain("blockchain.txt", "remoteBlockchain.txt").message)