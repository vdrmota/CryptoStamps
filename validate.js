var bitcoin = require('bitcoinjs-lib')
var bitcoinMessage = require('bitcoinjs-message')
var CoinKey = require('coinkey')
var imageHash = require('hasha')
var colors = require('colors/safe')

var blockchain = require('./blockchain.js')
var helpers = require('./functions.js')
var mempool = require('./mempool.js')

const blockchainFile = "blockchain.txt"
const remoteBlockchainFile = "remoteBlockchain.txt"
const stampsDir = "./stamps/"
const difficultyHistFile = "difficultyHist.json"
const stamps = helpers.listStamps(stampsDir)
const totalStamps = stamps.length
const updateInterval = 10000 
const difficulty = 4

function decodeSignature (buffer) 
{
  if (buffer.length !== 65) return false

  var flagByte = buffer.readUInt8(0) - 27
  if (flagByte > 7) return false

  return buffer.slice(1)
}

/*
	Validating a transaction
	- blockchainFile parameter specifies a blockchain state against which transaction should be verified
*/

function transaction (transaction, blockchainFile, mempoolEntry, verbose)
{
	// check that transaction has all components
	// this has to be done because transactions aren't hashed until they are mined
	if (!mempool.transactionStructure(transaction))
		return { "res": false, "message": "Transaction structure invalid." }

	// validation for coinbase transactions
	if (transaction.type == "coinbase")
	{
		try // since there is some dependency on libraries; to prevent crash caused by library
		{ 

			// if transaction wants to be entered into mempool, check if this reward has already been retrieved
			if (mempoolEntry)
			{
				if (blockchain.findReward(blockchainFile, transaction.origin))
				return { "res": false, "message": "Transaction reward already retrieved." }
			}
			
			// ensure that signature is a buffer

			var signature = Buffer.from(transaction.signature, 'base64')
			if(!signature instanceof Buffer)
				return { "res": false, "message": "Transaction binary invalid (1)." }
			if(!decodeSignature(signature))
				return { "res": false, "message": "Transaction binary invalid (2)." }

			// find origin hash on blockchain, checking if the block was mined by node asking for reward

			if (!blockchain.findHash(blockchainFile, transaction.origin, transaction.from))
				return { "res": false, "message": "Transaction origin invalid." }

			// check if stamp index was calculated correctly

			if (helpers.findNumFromHash(transaction.origin, totalStamps) != transaction.stamp)
				return { "res": false, "message": "Stamp calculation incorrect." }

			//check if signature is valid
			
			var filename = helpers.getStamp(transaction.stamp, stamps, stampsDir)
			var data = imageHash(filename)
			var signatureBuffer = new Buffer(transaction.signature, 'base64') // because signature comparison is in binary code
			if (!bitcoinMessage.verify(data, transaction.from, signatureBuffer))
				return { "res": false, "message": "Transaction signature invalid." }
			if (verbose)
				console.log("Transaction "+transaction.signature+" is "+colors.green("valid")+".")
			return { "res": true, "message": "Success." } // transaction is valid
		
		}
		catch (err)
		{
			return false
		}
	}
}

/*
	 Validating a block
*/

function block (block)
{

	// check if signature of block's payload is valid
	if (!helpers.verifySignature(
	        JSON.stringify(block.payload), 
	        block.issuer,
	        block.signature
    	))
    {
        return {"res": false, "message": "Block signature invalid."}
    }

	// check if payload in block is valid
	if (!transaction(block.payload, remoteBlockchainFile, false, false).res)
		return {"res": false, "message": "Block payload invalid."}

	// check that miner didn't mine his/her own reward
	// disable this during debugging
	// if (block.issuer == block.payload.from)
	// 	return {"res": false, "message": "Block miner mined own reward."}

	// ensure that timestamp wasn't tampered with
	// if (!helpers.timestampCheck(block.timestamp))
	// 	return {"res": false, "message": "Block timestamp invalid."}

	/*
		no difficulty check is necessary: miners race to find the highest difficult 
		because the blockchain with most work is truth
	*/

	return {"res": true, "message": "Block signature invalid."} // block is valid

}

/*
	 Validating a blockchain
	 - blockchainFile parameter is the local blockchain state
	 - remoteBlockchainFile parameter is the remote blockchain state (incoming)
	 ** To update local blockchain state (if remote blockchain is valid), run blockchain.update
*/

function chain (blockchainFile, remoteBlockchainFile)
{
	var localChain = blockchain.read(blockchainFile, difficulty, updateInterval, false)
	var remoteChain = blockchain.read(remoteBlockchainFile, difficulty, updateInterval, false)

	// check if local blockchain state is valid
	var localValidation = localChain.validateChain()
	if (!localValidation.res)
		return {"res": false, "message": colors.red("LOCAL BLOCKCHAIN INVALID! ") + "Error: " + localValidation.message }

	// check if received blockchain state is valid
	var remoteValidation = remoteChain.validateChain()
	if (!remoteValidation.res)
		return {"res": false, "message": colors.red("REMOTE BLOCKCHAIN INVALID! ") + "Error: " + remoteValidation.message } 

	// find which chain has more work i.e. is more true
	var workDiff = remoteChain.calculateWork() - localChain.calculateWork()
	if (workDiff < 1)
		return {"res": false, "message": colors.yellow("Remote chain doesn't have more work. Nothing to validate.") } // remote chain doesn't have more work

	// find which blocks local state is missing -> these need to be validated
	var newBlocks = blockchain.blocksDiff(localChain, remoteChain)
	var newBlocksValid = true // assume blocks are valid until proven otherwise

	// iterate through the new blocks -> check if each is valid
	for (var i = 0, n = newBlocks.length; i < n; i++)
	{ 
		var verifyBlock = block(newBlocks[i], newBlocks[i])
		if (!verifyBlock.res)
		{
			console.log(colors.red("INVALID BLOCK FOUND! ") + "Remote block #" + (i+1) + " Error: " + verifyBlock.message)
			newBlocksValid = false
		}
		else
		{
			console.log(colors.green("Remote block #" + (i+1) + " validated."))
		}
	}
	if (!newBlocksValid)
		return {"res": false, "message": "Remote chain contains invalid blocks."}

	return {"res": true, "message": "Success."} // if the blockchain is fully valid
}

console.log(chain("blockchain.txt", "remoteBlockchain.txt").message)

// if remote blockchain has more work, is valid, and all its blocks are valid -> adopt it locally

