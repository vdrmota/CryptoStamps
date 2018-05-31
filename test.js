var blockchain = require('./blockchain.js')

var localChain = blockchain.read("blockchain.txt", 4, 10000, false)
var remoteChain = blockchain.read("remoteBlockchain.txt", 4, 10000, false)

var newBlocks = blockchain.blocksDiff(localChain, remoteChain)

console.log(newBlocks)