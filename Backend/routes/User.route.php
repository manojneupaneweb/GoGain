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
    } elseif ($method === 'POST' && preg_match('/\/login\/?$/', $uri)) {
        $userController->loginUser();
    } elseif ($method === 'POST' && preg_match('/\/send-otp\/?$/', $uri)) {
        $userController->sendOtp();
    } elseif ($method === 'POST' && preg_match('/\/verify-otp\/?$/', $uri)) {
        $userController->verifyOtp();
    } elseif ($method === 'POST' && preg_match('/\/contactform\/?$/', $uri)) {
        $userController->contactform();
    } elseif ($method === 'GET' && preg_match('/\/getcontactform\/?$/', $uri)) {
        $userController->getcontactform();
    } elseif ($method === 'POST' && preg_match('/\/forgetpassword\/?$/', $uri)) {
        $userController->forgetPassword();
    }elseif ($method === 'POST' && preg_match('/\/refreshtoken\/?$/', $uri)) {
        $userController->refreshToken();
    } 



    //procted routes -------------------🔐 Only logged-in users can access
    elseif ($method === 'GET' && preg_match('/\/getuser\/?$/', $uri)) {
        checkAuth(); // 
        $userController->getUser();
    } elseif ($method === 'GET' && preg_match('/\/getuserprofile\/?$/', $uri)) {
        checkAuth(); // 
        $userController->getUserProfile();
    } elseif ($method === 'POST' && preg_match('/\/change-password\/?$/', $uri)) {
        checkAuth(); // middleware to ensure only admin can access
        $userController->ChangePassword();
    } elseif ($method === 'GET' && preg_match('/\/myorders\/?$/', $uri)) {
        checkAuth(); // 
        $userController->getMyOrders();
    }
    //verify user login or not 
    elseif ($method === 'GET' && preg_match('/\/verify-user\/?$/', $uri)) {
        checkAuth(); // 
        $userController->verifyUser();
    } else {
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
