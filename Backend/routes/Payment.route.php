<?php
require_once __DIR__ . '/../controllers/pay.controller.php';
$payController = new payController();

if ($method === 'POST' && preg_match('/\/khalti\/initiate\/?$/', $uri)) {
    require_once __DIR__ . '/../middleware/auth.middleware.php';
    $payController->initiateKhaltiPayment(json_decode(file_get_contents("php://input"), true));
}
