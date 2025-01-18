<?php
header('Content-Type: application/json');
require_once '../config.php';
require_once '../classes/PlayerManager.php';

$players = new PlayerManager();

switch($_GET['action']) {
    case 'online':
        echo json_encode($players->getOnlinePlayers());
        break;
    
    case 'update':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $playerId = $_POST['player_id'] ?? '';
            $action = $_POST['action'] ?? '';
            $data = $_POST['data'] ?? array();
            echo json_encode($players->updatePlayer($playerId, $action, $data));
        }
        break;
    
    case 'history':
        $identifier = $_GET['identifier'] ?? '';
        echo json_encode($players->getPlayerHistory($identifier));
        break;
}
