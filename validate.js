// receive mined block to validate

// validate block or deny it; make sure to check that miner didn't mine his own transaction

// validate or deny reward; check if transaction has already been mined; by checking if this hash already exists

// broadcast decision

// remove transaction from mempool -- but if denied, add it back to mempool and broadcast these

// update state of blockchain