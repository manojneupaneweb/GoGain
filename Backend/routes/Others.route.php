<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../controllers/cart.controller.php';
require_once __DIR__ . '/../middleware/auth.middleware.php';

header('Content-Type: application/json');

$pdo = $pdo;

$cartController = new CartController($pdo);
$orderController = new OrderController($pdo);
$planController = new PlanController($pdo);

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

try {
    if ($method === 'POST' && preg_match('/\/addtocart\/?$/', $uri)) {
        checkAuth();
        $cartController->addToCart();
    } elseif ($method === 'GET' && preg_match('/\/getcartitem\/?$/', $uri)) {
        checkAuth();
        $cartController->GetCartItem();
    } elseif ($method === 'DELETE' && preg_match('/\/cart\/delete\/([a-zA-Z0-9\-]+)\/?$/', $uri, $matches)) {
        checkAuth();
        $productId = $matches[1];
        $cartController->DeleteCartItem($productId);
    } elseif ($method === 'PUT' && preg_match('/\/cart\/([a-zA-Z0-9\-]+)/', $uri, $matches)) {
        checkAuth();
        $productId = $matches[1];
        $cartController->updateCartQuantity($productId);
    } elseif ($method === 'POST' && preg_match('/\/createorder\/?$/', $uri)) {
        checkAuth();
        header('Content-Type: application/json');
        echo json_encode($orderController->createOrder());
        exit;
    } elseif ($method === 'POST' && preg_match('#/createplan/?$#', $uri)) {
        checkAuth();
        $planController->createPlan();
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Route not found', 'data' => null]);
    }
} catch (Exception $e) {
            error_log($e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred'
    ]);
}
