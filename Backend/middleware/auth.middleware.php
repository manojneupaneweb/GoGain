<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function loadUserFromAccessCookie()
{
    header('Content-Type: application/json');

    $token = $_COOKIE['access_token'] ?? '';
    if ($token === '') {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Unauthorized. Token not provided.'
        ]);
        exit;
    }

    try {
        $decoded = JWT::decode($token, new Key($_ENV['ACCESS_TOKEN_SECRET'], 'HS256'));
    } catch (Exception $e) {
        error_log($e->getMessage());
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Unauthorized. Invalid or expired token.'
        ]);
        exit;
    }

    global $pdo;
    $stmt = $pdo->prepare("SELECT id, fullName, email, phone, gender, role, avatar FROM users WHERE id = ?");
    $stmt->execute([$decoded->sub]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Unauthorized. Invalid or expired token.'
        ]);
        exit;
    }

        $GLOBALS['auth_user'] = $user;

    return $user;
}

function authUserId()
{
    return $GLOBALS['auth_user']['id'] ?? null;
}

function checkAuth()
{
    loadUserFromAccessCookie();
}

function userHasRole(array $user, $role)
{
    return ($user['role'] ?? '') === $role;
}

function checkAdminAuth()
{
    $user = loadUserFromAccessCookie();
    if (!userHasRole($user, 'admin')) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Forbidden. Admin privileges required.'
        ]);
        exit;
    }
}

function checkTrainerAuth()
{
    $user = loadUserFromAccessCookie();
    if (!userHasRole($user, 'trainer')) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Forbidden. Trainer privileges required.'
        ]);
        exit;
    }
}
