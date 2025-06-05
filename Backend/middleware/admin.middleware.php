<?php
require_once 'vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function checkAdminAuth()
{
    header('Content-Type: application/json');
    $headers = getallheaders();

    // Check if Authorization header exists
    if (!isset($headers['Authorization'])) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Unauthorized. Token not provided.'
        ]);
        exit;
    }

    // Validate token format
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
    $secretKey = 'your_secret_key_here'; // Replace with your actual secret key

    try {
        // Decode and verify the token
        $decoded = JWT::decode($token, new Key($secretKey, 'HS256'));
        
        // Check if the user has admin role
        if (!isset($decoded->role) || $decoded->role !== 'admin') {
            http_response_code(403);
            echo json_encode([
                'success' => false,
                'message' => 'Forbidden. Admin privileges required.'
            ]);
            exit;
        }

        // Store user information in session
        session_start();
        $_SESSION['user_id'] = $decoded->sub;
        $_SESSION['user_role'] = $decoded->role;

    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Unauthorized. Invalid or expired token.'
        ]);
        exit;
    }
}