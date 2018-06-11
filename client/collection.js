global.$ = $

var fs = require("fs")
var config = require("../config.js")
var helpers = require("../functions.js")
var blockchain = require("../blockchain.js")

const credentialsFile = "../"+config.credentialsFile
const blockchainFile = "../"+config.blockchainFile

function search (publicKey)
{
    var chain = blockchain.read(blockchainFile).chain
    var stamps = []
    
    for (var i = 0, n = chain.length; i < n; i++)
    {
        if (chain[i].payload.type == "coinbase" && chain[i].payload.from == publicKey)
          stamps.push(chain[i].payload.stamp)
    }

    return stamps
}

$(document).ready(function() {

  // if the user hasn't registered yet
  if (!fs.existsSync(credentialsFile)) 
  {
    $("#main").load("register.html")
    return 1
  }

  $("#main").html("<p>Welcome!</p>")
  $("#main").append("<p>Your public key is: "+helpers.getCredentials(credentialsFile).publicKey+"</p>")
  $("#main").append("<p>Your username is: "+helpers.getCredentials(credentialsFile).username+"</p>")

  $("#main").append("<p>Your stamps:</p>")

  var stamps = search(helpers.getCredentials(credentialsFile).publicKey)

  for (var i = 0, n = stamps.length; i < n; i++)
  {
      $("#main").append("<p>"+stamps[i]+"</p>")
  }

});
