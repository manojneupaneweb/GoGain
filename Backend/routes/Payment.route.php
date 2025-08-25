<?php
require_once __DIR__ . '/../controllers/pay.controller.php';
require_once __DIR__ . '/../middleware/auth.middleware.php';

$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

$payController = new PaymentController();

if ($method === 'POST' && preg_match('/\/khalti\/initiate\/?$/', $uri)) {
    checkAuth();
    $payController->initiateKhaltiPayment();
}elseif ($method === 'POST' && preg_match('/\/khalti\/verify\/?$/', $uri)) {
    checkAuth();
    $payController->verifyPayment(); // expects { pidx } in JSON body
}
