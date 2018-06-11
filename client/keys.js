var config = require("../config.js")
var helpers = require("../functions.js")
var fs = require("fs")

var credentialsFile = "../"+config.credentialsFile

var credentials = helpers.getCredentials(credentialsFile)

$(document).ready(function() {

    // if the user hasn't registered yet
    if (!fs.existsSync(credentialsFile)) 
    {
        $("#main").load("register.html")
        return 1
    }

    $("#main").html("<p>Your public key is: "+credentials.publicKey+"</p>")
    $("#main").append("<p>Your username is: "+credentials.username+"</p>")
    $("#main").append("<p>You can see your private key in credentials.txt</p>")


})