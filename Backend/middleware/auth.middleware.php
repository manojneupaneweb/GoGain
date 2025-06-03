<?php
require_once 'vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function checkAuth()
{
    header('Content-Type: application/json');
    $headers = getallheaders();

    if (!isset($headers['Authorization'])) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Unauthorized. Token not provided.'
        ]);
        exit;
    }

    $authHeader = $headers['Authorization'];
    if (strpos($authHeader, 'Bearer ') !== 0) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Unauthorized. Invalid token format.'
        ]);
        exit;
    }

    $token = substr($authHeader, 7);
    $secretKey = 'your_secret_key_here';

    try {
        $decoded = JWT::decode($token, new Key($secretKey, 'HS256'));

        // ✅ SET user ID in session here
        session_start();
        $_SESSION['user_id'] = $decoded->sub;

    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Unauthorized. Invalid or expired token.'
        ]);
        exit;
    }
}

