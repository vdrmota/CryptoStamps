// import modules

var fs = require('fs');
var colors = require('colors/safe')

// import functions

var helpers = require('./functions.js');
var mempool = require('./mempool.js');
var blockchain = require('./blockchain.js');
var broadcast = require('./broadcast.js')
var rewards = require('./rewards.js')

// import classes

var classes = require('./classes.js');
var Block = classes.Block;
var LoadBlock = classes.LoadBlock;
var LoadBlockchain = classes.LoadBlockchain;
var User = classes.User;

// define variables

const difficulty = 4;
const blockchainFile = "blockchain.txt"
const mempoolFile = "mempool.txt"
const rewardsFile = "rewards.txt"
const credentialsFile = "credentials.txt"
const updateInterval = 10000 // how often to update mempool (lower number = more often therefore lower chance of orphaned chain, but longer time to mine)
var nonce = 0 // stores nonce in case mining continues after mempool refresh
var emptyMempoolSwitch = false // only alert client if mempool is empty once
var blockFound = true // triggers the mining of a new block

// define miner functions

function blockMined(chain, transactionIndex)
{
	// add block to blockchain
	helpers.exportBlockchain(blockchainFile, chain);
	// broadcast blockchain
	broadcast.blockchain(blockchainFile)
	// set pending reward for yourself
	rewards.pending(chain.chain.slice(-1)[0].hash, rewardsFile) 
	// retrieve reward
	rewards.retrieve(rewardsFile)
	// refresh mempool
	//mempool.refresh()
	// remove just-mined transaction from my mempool
	mempool.remove(transactionIndex)
	//broadcast.mempool(mempoolFile)
	// start mining new block
	blockFound = true
}

function blockNotMined(transaction)
{
	// update local state of blockchain
	//blockchain.refresh()
	// refresh local state of mempool
	//mempool.refresh()
	// check if transaction is still in mempool
	/*if (mempool.exists(transaction))
		blockFound = false
	else	
		blockFound = true*/
	blockFound = false
}

// retrieve miner credentials

let fetchCredentials = helpers.getCredentials(credentialsFile);
let credentials = new User(fetchCredentials.username, fetchCredentials.privateKey, fetchCredentials.publicKey);

// load blockchain and mempool

//mempool.refresh()
//blockchain.refresh() 
var chain = blockchain.read(blockchainFile, difficulty, updateInterval)
var blockHeight = chain.chain.length; 

// begin mining

while (true)
{

	// check if a block was just mined
	if (blockFound)
	{
		// retrieve mempool
		var mempoolData = mempool.read(mempoolFile)

		// quit if mempool is empty
		if (!mempoolData)
		{
			if (!emptyMempoolSwitch)
			{
				console.log(colors.blue("Mempool is empty. Exiting..."))
				emptyMempoolSwitch = true
			}
			continue
		}

		// mempool isn't empty
		emptyMempoolSwitch = false

		// pick a random transaction from mempool
		var randomTransaction = mempool.random(mempoolData)
		var transaction = randomTransaction[0]
		var transactionIndex = randomTransaction[1]

		// validate transaction locally

		// store timestamp
		var timestamp = Date.now()

		console.log("Mining new block...")

		var blockStruct = new Block(
			blockHeight, 
			timestamp,
			transaction, 
			credentials.publicKey, 
			credentials.privateKey 
		)

		// start mining new block

		if (chain.addBlock(blockStruct))
			// block was mined
			blockMined(chain, transactionIndex)
		else
			// block wasn't mined
			blockNotMined(transaction)

		// increase block height
		blockHeight++

	}
	else
	{
		// continue mining previous block

		if (chain.continueMining())
			// block was mined
			blockMined(chain, transactionIndex)
		else
			// block wasn't mined
			blockNotMined(transaction)
	}
}