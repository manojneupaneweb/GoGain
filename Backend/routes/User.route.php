<?php
require_once __DIR__ . '/../controllers/UserController.php';

$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

if ($method === 'GET' && str_ends_with($uri, '/api/v1/user')) {
    UserController\getUsers($pdo);
}
