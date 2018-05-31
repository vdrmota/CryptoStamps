// load modules

var CoinKey = require('coinkey');
var fs = require('fs');
var colors = require('colors/safe')
var request = require('urllib-sync').request;
const SHA512 = require('js-sha512');
var bitcoinMessage = require('bitcoinjs-message');

// converts string into hexadecimal

function toHex(str) 
{
    var hex = "";

    for(var i = 0; i < str.length; i++) 
    {
        hex += "" + str.charCodeAt(i).toString(16);
    }

    return hex;
}

// finds the median timestamp of last count blocks on remoteChain

function median(localChain, count)
{
    var length = localChain.chain.length
    var timestamps = []

    // loops from last block to 11th block from end
    for (var i = length-1; i > length-12; i--)
    {
        try 
        {
            timestamps.push(localChain.chain[i].timestamp)
        }
        catch (err)
        {
            break
        }
    }

    timestamps = timestamps.sort((a, b) => a - b)

    return timestamps[parseInt(timestamps.length / 2)]
}

// export the functions below as helpers

module.exports = {

  // generates a random hexadecimal private key

  makePrivateKey: function () {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 32; i++)
    {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return toHex(text);
  },

  // generates a public key for a given private key

  generateAddress: function (privateKey)
  {
      var key = new CoinKey(new Buffer(privateKey, "hex"));
      key.compressed = false;

      return key.publicAddress
  },

  // exports blockchain into text file

  exportBlockchain: function (filename, blockchain)
  {
      fs.writeFileSync(filename, JSON.stringify(blockchain))
      console.log("Blockchain exported.");
  },

  // saves user credentials

  saveUser: function (filename, user)
  {
      fs.writeFile(filename, user, function(err) 
      {
        if (err) 
        {
            return console.log(err);
        }

        console.log(colors.green("Successfully saved to "+ filename + "."));

      });
  },

  // creates credentials for user

  credentials: function (user)
  {
    return user["name"]+"\n"+user.publicKey+"\n"+user.privateKey+"\n"
  },

  // retrieves credentials for the user

  getCredentials: function(filename)
  {
    let credentialsFile = (fs.readFileSync(filename).toString()).split("\n");

    return {"username": credentialsFile[0], "publicKey": credentialsFile[1], "privateKey": credentialsFile[2]};
  },

  // hash string with sha256

  generateHash: function (string)
  {
      return SHA512(string).toString();
  },

  getUrlContents: function (url, filename)
  {
      var file = fs.createWriteStream(filename);

      fs.writeFileSync(filename, request(url).data.toString("utf-8"))
  },

  getStamp: function (number, stamps, directory)
  {
      return directory+stamps[number]
  },

  listStamps: function(directory)
  {
      return fs.readdirSync(directory)
  },

  findNumFromHash: function(hash, totalStamps)
  {
    let length = hash.length
    return (parseInt(hash[length - 4], 16) + parseInt(hash[length - 3], 16) + parseInt(hash[length - 2], 16) + parseInt(hash[length - 1], 16)) % totalStamps
  },

  // checks whether a message was signed by the private key corresponding to the public key
  // works because of asymmetric encryption
  // returns true if private key (corresponding to publicKey) was used to sign message
  // useful for checking whether node (represented by publicKey) indeed approved of message

  verifySignature: function (message, publicKey, signature)
  {
    try 
    { // since there is dependency on library; to prevent crash caused by library
        if (!bitcoinMessage.verify(message, publicKey, signature))
        {
            return false
        }
    }
    catch (err)
    {
        return false
    }
      return true
  },

  // checks whether a timestamp is valid
  // returns true if timestamp is greater than median of past 11 blocks (valid) ...
  // ... and lower than current unix (epoch + 2 hours)
  // returns false if timestamp is not valid

  timestampCheck: function (timestamp, localChain)
  {
      var upperBound = Date.now() + 7200 // 2 hours from now
      var lowerBound = median(localChain, 11) // median of last 11 blocks
      
      return timestamp > lowerBound && timestamp < upperBound
  }

};