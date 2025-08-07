<?php
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

switch (true) {
    case str_starts_with($uri, "/api/v1/user"):
        require_once __DIR__ . '/User.route.php';
        break;

    case str_starts_with($uri, "/api/v1/product"):
        require_once __DIR__ . '/Product.route.php';
        break;

    case str_starts_with($uri, "/api/v1/cart"):
        require_once __DIR__ . '/Others.route.php';
        break;

    case str_starts_with($uri, "/api/v1/payment"):
        require_once __DIR__ . '/Payment.route.php';
        break;
    case str_starts_with($uri, "/api/v1/admin"):
        require_once __DIR__ . '/Admin.route.php';
        break;

    default:
        http_response_code(404);
        echo json_encode(["message" => "Route not found"]);
        break;
}
