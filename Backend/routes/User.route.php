<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../controllers/UserController.php';

header('Content-Type: application/json');

// Initialize PDO connection and UserController
$pdo = require __DIR__ . '/../config/db.php';
$userController = new UserController($pdo);

// Get request method and URI
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Route handling
try {
    // Register route
    if ($method === 'POST' && preg_match('/\/register\/?$/', $uri)) {
        $userController->registerUser();
    }
    // Login route
    elseif ($method === 'POST' && preg_match('/\/login\/?$/', $uri)) {
        $userController->loginUser();
    }
    // 404 fallback
    else {
        http_response_code(404);
        echo json_encode(['message' => 'Route not found']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'message' => 'An error occurred',
        'error' => $e->getMessage()
    ]);
}