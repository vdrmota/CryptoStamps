// var sign = require("./sign.js")

// sign.sign("0618c48771b01f9818356d6e3dc96b8d9e2b7e37cb078f5120d10567d6dccf8c542b09f1f0cf59fe08252f86aaa056f2a064096cc37bef2e27ee5d90d45b9c0d")

var blockchain = require("./blockchain.js")

var chain = blockchain.read("blockchain.txt", 5, 10000, true)

console.log(chain.chain.length)