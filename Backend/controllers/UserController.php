<?php
namespace UserController;

function getUsers($pdo) {
    $stmt = $pdo->query("SELECT * FROM users");
    $users = $stmt->fetchAll(\PDO::FETCH_ASSOC);

    header('Content-Type: application/json');
    echo json_encode($users);
}
