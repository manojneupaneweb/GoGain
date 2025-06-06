<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../controllers/product.controller.php';
require_once __DIR__ . '/../middleware/admin.middleware.php';

header('Content-Type: application/json');

$pdo = require __DIR__ . '/../config/db.php';
$productController = new ProductController($pdo);
$cartController = new CartController($pdo);


$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

try {


    //procted routes -------------------🔐 Only logged-in users can access
    if ($method === 'POST' && preg_match('/\/addproduct\/?$/', $uri)) {
        checkAdminAuth();
        $productController->createProduct();
    } elseif ($method === 'GET' && preg_match('/\/getallproduct\/?$/', $uri)) {
        $productController->getAllProduct();
    } elseif ($method === 'GET' && preg_match('/\/api\/v1\/product\/([\w-]+)/', $uri, $matches)) {
        $id = $matches[1];
        $productController->getProductByID($id);
    }



    // ------------------ cart  product routes -------------------
   elseif ($method === 'POST' && preg_match('/\/addtocart/', $uri)) {
    $cartController->addToCart();
}




    // -----------------------------------------------------------
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