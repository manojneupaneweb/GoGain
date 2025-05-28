<?php
namespace Models;

class User {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function getAll() {
        $stmt = $this->pdo->query("SELECT id, name, email FROM users");
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
}
