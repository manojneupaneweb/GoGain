<?php
require_once __DIR__ . '/../controllers/pay.controller.php';
require_once __DIR__ . '/../middleware/auth.middleware.php';

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$payController = new PaymentController($pdo);

if ($method === 'POST' && preg_match('/\/khalti\/initiate\/?$/', $uri)) {
    checkAuth();
    $payController->initiateKhaltiPayment();
} elseif ($method === 'POST' && preg_match('/\/khalti\/verify\/?$/', $uri)) {
    checkAuth();
    $payController->verifyPayment();
} elseif ($method === 'POST' && preg_match('/\/esewa\/initiate\/?$/', $uri)) {
    checkAuth();
    $payController->initiateEsewaPayment();
} elseif ($method === 'POST' && preg_match('/\/esewa\/verify\/?$/', $uri)) {
    checkAuth();
    $payController->verifyEsewaPayment();
} else {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Route not found']);
}
