var helpers = require('./functions.js')

const blockchainFile = "blockchain.txt" // local blockchain file
const mempoolFile = "mempool.txt" // local mempool file
const difficultyHistoryFile = "difficultyHist.json" // local difficulty history file
const SHA512 = require('js-sha512'); // hash algorithm
const credentialsFile = "credentials.txt" // local credentials file
const difficulty = 5; // blockchain difficulty
const rewardsFile = "rewards.txt" // local rewards file
const updateInterval = 10000 // how often to update mempool (lower number = more often therefore lower chance of orphaned chain, but longer time to mine)
const stampsDir = "./stamps/" // local stamps directory
const stamps = helpers.listStamps(stampsDir) // this holds a list of all possible stamps
const totalStamps = stamps.length
const remoteBlockchainFile = "remoteBlockchain.txt" // local file of remote (incoming) blockchain

// export

exports.blockchainFile = blockchainFile
exports.mempoolFile = mempoolFile
exports.difficultyHistoryFile = difficultyHistoryFile
exports.SHA512 = SHA512
exports.credentialsFile = credentialsFile
exports.difficulty = difficulty
exports.rewardsFile = rewardsFile
exports.updateInterval = updateInterval
exports.stampsDir = stampsDir
exports.stamps = stamps
exports.totalStamps = totalStamps
exports.remoteBlockchainFile = remoteBlockchainFile