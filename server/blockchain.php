<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

use ElephantIO\Client;
use ElephantIO\Engine\SocketIO\Version2X;

require __DIR__ . '/vendor/autoload.php';

$client = new Client(new Version2X('http://localhost:1337', [
    'headers' => [
        'X-My-Header: websocket rocks',
        'Authorization: Bearer 12b3c4d5e6f7g8h9i'
    ]
]));

// check if blockchain file is there

if (!isset($_POST['blockchain']))
{
	die("Missing file.");
}

// store a state of the block

$myfile = fopen("blockchain.txt", "w") or die("Unable to open file!");
$txt = $_POST['blockchain'];
fwrite($myfile, $txt);
fclose($myfile);

// send server new blockchain
// the server will then emit it to all connected nodes

$client->initialize();
$client->emit('emit_blockchain', [$txt]);
$client->close();

?>