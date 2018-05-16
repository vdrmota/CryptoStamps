<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if (!isset($_POST['blockchain']))
{
	die("Missing file.");
}

$myfile = fopen("blockchain.txt", "w") or die("Unable to open file!");
$txt = $_POST['blockchain'];
fwrite($myfile, $txt);
fclose($myfile);

?>