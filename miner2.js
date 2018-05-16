// import modules

var fs = require('fs');

// import functions

var helpers = require('./functions.js');

// import classes

var classes = require('./classes.js');
var Block = classes.Block;
var Blockchain = classes.Blockchain;
var LoadBlock = classes.LoadBlock;
var LoadBlockchain = classes.LoadBlockchain;
var User = classes.User;

// define blockchain difficulty
const difficulty = 2;

/*
    START CREATING NEW BLOCKCHAIN
*/

// retrieve miner credentials

let fetchCredentials = helpers.getCredentials();

let credentials = new User(fetchCredentials.username, fetchCredentials.privateKey, fetchCredentials.publicKey);

// create new blockchain, including genesis block

let initialBlockchain = new Blockchain(difficulty);

// mine first block onto chain

console.log("Mining block 1...");

initialBlockchain.addBlock(new Block(1, "11/01/2018", { type: "contract", contract: { from: credentials.publicKey, code: "" }, withdrawal: { from: credentials.publicKey, to: "", amount: "", details: ""}, deposit: { from: "", amount: "", interest: "", period: "" }, installment: { from: "", to: "", details: "" } }, credentials.publicKey, credentials.privateKey ));

// mine second block onto chain

console.log("Mining block 2...")

initialBlockchain.addBlock(new Block(2, "11/01/2018", { type: "contract", contract: { from: credentials.publicKey, code: "" }, withdrawal: { from: credentials.publicKey, to: "", amount: "", details: ""}, deposit: { from: "", amount: "", interest: "", period: "" }, installment: { from: "", to: "", details: "" } }, credentials.publicKey, credentials.privateKey ));

// report whether blockchain is valid

console.log("Blockchain valid? " + initialBlockchain.isChainValid(difficulty));

// export blockchain into file

helpers.exportBlockchain("blockchain.txt", initialBlockchain);

/*
    END CREATING NEW BLOCKCHAIN
*/

/*
    START IMPORTING AND USING EXISTING BLOCKCHAIN
*/

// define where blockchain exists

var fileName = "blockchain.txt";

// read blockchain from text file

fs.readFile(fileName, "utf8", function(err, contents) 
{

    // load text file into object

    contents = JSON.parse(contents)

    // load blockchain from text file including the genesis block

    let newChain = new LoadBlockchain(difficulty, contents.chain[0].timestamp, contents.chain[0].issuer, contents.chain[0].signature, contents.chain[0].hash, contents.chain[0].nonce);

    // load all already-mined blocks from text file into blockchain

    var l = contents.chain.length;

    for (var i = 1; i < l; i++) 
    {
        newChain.oldBlock(new LoadBlock(contents.chain[i].index, contents.chain[i].timestamp, contents.chain[i].data, contents.chain[i].issuer, contents.chain[i].signature, contents.chain[i].hash, contents.chain[i].nonce));
    }

    // mine 4 new blocks onto blockchain

    for (var i = l; i < l+4; i++)
    {
        console.log("Mining block " + i + "...");

        newChain.addBlock(new Block(i, "11/01/2018", { type: "deposit", withdrawal: { from: credentials.publicKey, to: "", amount: i, details: ""}, deposit: { from: "", amount: "", interest: "", period: "" }, installment: { from: "", to: "", details: "" } }, credentials.publicKey, credentials.privateKey ));
    }

    // report whether blockchain is still valid
    
    console.log("Blockchain valid? " + newChain.isChainValid(difficulty));

    // example of how to retrieve whom a 'withdrawal' was from, given the type is 'withdraw' in the block

    //console.log(newChain.chain[1].data[newChain.chain[1].data.type].from);

    // update text file with new state of the blockchain

    helpers.exportBlockchain("blockchain.txt", newChain);

});

/*
    END IMPORTING AND USING EXISTING BLOCKCHAIN
*/