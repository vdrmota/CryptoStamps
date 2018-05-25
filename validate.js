// receive mined block to validate

// check that image signature is valid -- you have the data and the public key, so check if it was signed by correct private key

// validate block or deny it; make sure to check that miner didn't mine his own transaction

// check if previous hash is the same as you have; check that your blockchain is legal first.

// validate or deny reward; check if transaction has already been mined; by checking if this hash already exists

// broadcast decision

// remove transaction from mempool -- but if denied, add it back to mempool and broadcast these

// update state of blockchain

/*
	 Validating a block
*/

// check if block is valid

// append it to chain, see if chain is valid

/*
	Validating a transaction
*/