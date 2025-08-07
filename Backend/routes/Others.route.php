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
    // Protected product routes 🔐
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && preg_match('/\/addtocart\/?$/', $_SERVER['REQUEST_URI'])) {
        checkAuth();
        $cartController->addToCart();

    } elseif ($method === 'GET' && preg_match('/\/getcartitem\/?$/', $uri)) {
        checkAuth();
        $cartController->GetCartItem();

    } elseif ($method === 'DELETE' && preg_match('/\/cart\/delete\/([a-zA-Z0-9\-]+)\/?$/', $uri, $matches)) {
        checkAuth();
        $productId = $matches[1];
        $cartController->DeleteCartItem($productId);

    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT' && preg_match('/\/cart\/([a-zA-Z0-9\-]+)/', $uri, $matches)) {
        checkAuth();
        $productId = $matches[1];
        $cartController->updateCartQuantity($productId);
    }






    //--------------------------- order routes -------------------------------------
    elseif ($method === 'POST' && preg_match('/\/createorder\/?$/', $uri)) {
        checkAuth();
        header('Content-Type: application/json');
        echo json_encode($orderController->createOrder());
        exit;
    } elseif ($method === 'GET' && preg_match('/\/getorderitem\/?$/', $uri)) {
        checkAuth();
        $orderController->GetOrderItem();
    }





    //plan route 
    elseif ($method === 'POST' && preg_match('/\/createplan\/?$/', $uri)) {
        require_once __DIR__ . '/../middleware/auth.middleware.php';
        checkAuth();
        header('Content-Type: application/json');
        echo json_encode($planController->createplan(json_decode(file_get_contents('php://input'), true)));
        exit;
    }



















    //payment routes
    elseif ($method === 'POST' && preg_match('/\/khalti\/initiate\/?$/', $uri)) {
        require_once './middlewares/checkAuth.php'; // optional if auth needed
        $khaltiController->initiatePayment(json_decode(file_get_contents("php://input"), true));
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
