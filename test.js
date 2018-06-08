
function mode(array)
{

	var maxCount = 0
	var map = {}
	var mode = {"from": null, "hash": null}

	for (var i = 0, n = array.length; i < n; i++)
	{
		map[array[i].hash] = map[array[i].hash] ? map[array[i].hash]+1 : 1
		if (map[array[i].hash] > maxCount)
		{
			mode.hash = array[i].hash
			mode.from = array[i].from
			maxCount = map[array[i].hash]
		}
	}
	return mode
}


test = [{"from": "a", "hash": "3"},{"from": "f", "hash": "2"},{"from": "b", "hash": "2"},{"from": "c", "hash": "2"},{"from": "d", "hash": "2"}]

console.log(mode(test))