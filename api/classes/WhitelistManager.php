<?php
class WhitelistManager {
    private $db;

    public function __construct() {
        $this->db = new PDO("mysql:host=".DB_HOST.";dbname=".DB_NAME, DB_USER, DB_PASS);
    }

    public function getWhitelistEntries() {
        $stmt = $this->db->prepare("SELECT * FROM whitelist ORDER BY added_date DESC");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function addToWhitelist($identifier, $addedBy) {
        $stmt = $this->db->prepare("
            INSERT INTO whitelist (identifier, added_by, added_date) 
            VALUES (:identifier, :added_by, NOW())
        ");
        return $stmt->execute([
            'identifier' => $identifier,
            'added_by' => $addedBy
        ]);
    }

    public function removeFromWhitelist($identifier) {
        $stmt = $this->db->prepare("DELETE FROM whitelist WHERE identifier = :identifier");
        return $stmt->execute(['identifier' => $identifier]);
    }
}
