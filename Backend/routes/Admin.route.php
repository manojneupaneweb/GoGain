<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../middleware/admin.middleware.php';
require_once __DIR__ . '/../controllers/dashboard.controller.php';

header('Content-Type: application/json');

$pdo = $pdo;
$DashboardController = new DashboardController($pdo);

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

try {
    // Protected product routes 🔐
    if ($method === 'GET' && preg_match('/\/dashboard\/?$/', $uri)) {
        checkAdminAuth();
        $DashboardController->GetDashboard();
    } elseif ($method === 'GET' && preg_match('/\/getallusers\/?$/', $uri)) {
        checkAdminAuth();
        $DashboardController->getAllUsers();
    } elseif ($method === 'POST' && preg_match('/\/changerole\/?$/', $uri)) {
        checkAdminAuth();
        $DashboardController->ChangeRole();
    } elseif ($method === 'POST' && preg_match('/\/admin\/change-password\/?$/', $uri)) {
        checkAdminAuth(); // middleware to ensure only admin can access
        $DashboardController->ChangePassword();
    }
    // all role == user
    elseif ($method === 'GET' && preg_match('/\/getalluserinformation\/?$/', $uri)) {
        checkAdminAuth();
        $DashboardController->getAllUserInformation();
    }

    //all user plans 
    elseif ($method === 'GET' && preg_match('/\/getalluserplans\/?$/', $uri)) {
        checkAdminAuth();
        $DashboardController->getAllUserPlans();
    }
    //products
    elseif ($method === 'POST' && preg_match('/\/changestatus\/?$/', $uri)) {
        checkAdminAuth();
        $DashboardController->changeOrderStatus();
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
