<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../controllers/UserController.php';
require_once __DIR__ . '/../middleware/auth.middleware.php';

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
    elseif ($method === 'POST' && preg_match('/\/login\/?$/', $uri)) {
        $userController->loginUser();
    }
    elseif ($method === 'POST' && preg_match('/\/send-otp\/?$/', $uri)) {
        $userController->sendOtp();
    }
    elseif ($method === 'POST' && preg_match('/\/verify-otp\/?$/', $uri)) {
        $userController->verifyOtp();
    }


    //procted routes -------------------🔐 Only logged-in users can access
    elseif ($method === 'GET' && preg_match('/\/getuser\/?$/', $uri)) {
    checkAuth(); // 
    $userController->getUser();
}
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