<?php
class PlayerManager {
    private $db;

    public function __construct() {
        $this->db = new PDO("mysql:host=".DB_HOST.";dbname=".DB_NAME, DB_USER, DB_PASS);
    }

    public function getOnlinePlayers() {
        $stmt = $this->db->prepare("
            SELECT p.*, 
                   w.status as whitelist_status 
            FROM players p 
            LEFT JOIN whitelist w ON p.identifier = w.identifier 
            WHERE p.online = 1
        ");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function updatePlayer($playerId, $action, $data = array()) {
        switch($action) {
            case 'kick':
                return $this->kickPlayer($playerId, $data['reason'] ?? 'No reason specified');
            case 'ban':
                return $this->banPlayer($playerId, $data);
            case 'warn':
                return $this->warnPlayer($playerId, $data['message']);
        }
    }

    public function getPlayerHistory($identifier) {
        $stmt = $this->db->prepare("
            SELECT * FROM player_history 
            WHERE identifier = :identifier 
            ORDER BY timestamp DESC
        ");
        $stmt->execute(['identifier' => $identifier]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
