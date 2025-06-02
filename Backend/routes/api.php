<?php
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

switch (true) {
    case str_starts_with($uri, "/api/v1/user"):
        require_once __DIR__ . '/User.route.php';
        break;

    default:
        http_response_code(404);
        echo json_encode(["message" => "Route not found"]);
        break;
}
