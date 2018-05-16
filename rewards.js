var fs = require('fs');
var sign = require("./sign.js")

module.exports = {
	pending: function(hash, filename)
	{
		// add code here that adds a pending reward to file with hash
		fs.appendFileSync(filename, hash+"\n")
	},

	retrieve: function(filename)
	{
		var rewards = fs.readFileSync(filename).toString()
		rewards = rewards.split(/\n/)
		// retrieve each reward
		for (var i = 0, n = rewards.length; i < n; i++)
		{
			if (rewards[i].length > 0)
			{
				// retrieve reward
				sign.sign(rewards[i])
				// remove reward
				var oldData = fs.readFileSync(filename).toString()
				var replaced = oldData.replace(rewards[i], "")
				fs.writeFileSync(filename, replaced)
			}
		}
	}
}