<?php
require_once __DIR__ . '/../controllers/pay.controller.php';
require_once __DIR__ . '/../middleware/auth.middleware.php';
$payController = new PaymentController();

if ($method === 'POST' && preg_match('/\/khalti\/initiate\/?$/', $uri)) {
    checkAuth();
    $payController->initiateKhaltiPayment();
}
