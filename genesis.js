// import modules

var fs = require('fs');

// import functions

var helpers = require('./functions.js');

// import classes

var classes = require('./classes.js');
var config = require('./config.js')
var Block = classes.Block;
var Blockchain = classes.Blockchain;
var LoadBlock = classes.LoadBlock;
var LoadBlockchain = classes.LoadBlockchain;
var User = classes.User;

// define blockchain difficulty
const difficulty = config.difficulty
const interval = config.updateInterval
const blockchainFile = config.blockchainFile
const credentialsFile = config.credentialsFile

var timestamp = Date.now()

/*
    START CREATING NEW BLOCKCHAIN
*/

// retrieve miner credentials

let fetchCredentials = helpers.getCredentials(credentialsFile);

// create new blockchain, including genesis block

console.log("Mining genesis block...")

var newChain = new LoadBlockchain(
        difficulty, 
        interval, 
        timestamp, 
        fetchCredentials.publicKey, 
        "HBrLDbPBl+3QVwzgDfLhUllvbIRjmeoXfkgUfxDSDT2Gfgh/SBpZU2azA8/nlUgkSfiJRysNlPd77HlSHUH7V+A=", 
        "0618C48771B01F9818356D6E3DC96B8D9E2B7E37CB078F5120D10567D6DCCF8C542B09F1F0CF59FE08252F86AAA056F2A064096CC37BEF2E27EE5D90D45B9C0D", 
        177028
      )

// export blockchain into file

helpers.exportBlockchain(blockchainFile, newChain);