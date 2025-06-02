<?php
$host = 'localhost';
$db   = 'gogain';
$user = 'root';
$pass = '';

$dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";

try {
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ]);
    return $pdo; // ✅ This line is important
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Database connection failed', 'error' => $e->getMessage()]);
    exit;
}
