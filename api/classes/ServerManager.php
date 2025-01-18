<?php
class ServerManager {
    private $db;
    private $serverIP;
    private $serverPort;

    public function __construct() {
        $this->db = new PDO("mysql:host=".DB_HOST.";dbname=".DB_NAME, DB_USER, DB_PASS);
        $this->serverIP = FIVEM_SERVER_IP;
        $this->serverPort = FIVEM_SERVER_PORT;
    }

    public function getServerStatus() {
        $status = array(
            'online' => false,
            'players' => 0,
            'maxPlayers' => 32,
            'resources' => array(),
            'performance' => array()
        );

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "http://{$this->serverIP}:{$this->serverPort}/info.json");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $response = curl_exec($ch);
        curl_close($ch);

        if ($response) {
            $info = json_decode($response, true);
            $status['online'] = true;
            $status['players'] = $info['players'] ?? 0;
            $status['maxPlayers'] = $info['vars']['sv_maxClients'] ?? 32;
        }

        return $status;
    }

    public function getResources() {
        $stmt = $this->db->prepare("SELECT * FROM resources ORDER BY name ASC");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function updateResource($resourceName, $action) {
        switch($action) {
            case 'start':
                return $this->startResource($resourceName);
            case 'stop':
                return $this->stopResource($resourceName);
            case 'restart':
                return $this->restartResource($resourceName);
        }
    }
}
