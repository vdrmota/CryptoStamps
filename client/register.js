global.$ = $

// import modules

var fs = require('fs')
var config = require('../config.js')

// import functions

var helpers = require('../functions.js')

// import classes

var classes = require('../classes.js')
var User = classes.User

// define credentials file

const credentialsFile = "../"+config.credentialsFile

function register (username)
{
    // check if user already registered

    if (fs.existsSync(credentialsFile)) 
    {
        //return {"res": true, "message": "You have already registered. Check credentials.txt for info."}
        $("#main").html("You have already registered. Check credentials.txt for info.")
    }

    // generate user

    let user = new User(username)
    let credentials = helpers.credentials(user)

    // save credentials

    helpers.saveUser(credentialsFile, credentials)

    // print credentials

    //return {"res": true, "message": {"public": user.publicKey, "private": user.privateKey} }
    $("#main").html("<p>Your public key: "+user.publicKey+"</p><p>Your private key: "+user.privateKey+"</p><p><a href=''>Start playing!</a></p>")
}
