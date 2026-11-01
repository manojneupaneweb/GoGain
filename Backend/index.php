<?php

ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/php-error.log');
require_once __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/'); 
$dotenv->load();

$allowedOrigins = [
    $_ENV['CORS_ORIGIN'] ?? '',
]; 

header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: no-referrer');
header('Content-Type: application/json');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$originAllowed = $origin !== '' && in_array($origin, $allowedOrigins, true);
if ($originAllowed) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
    header("Vary: Origin");
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    if ($originAllowed) {
        header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-CSRF-Token");
        header("Access-Control-Max-Age: 3600");
    }
    http_response_code(204);
    exit();
}

require_once __DIR__ . '/utils/http.php';
registerExceptionHandler();

require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/utils/cookies.php';

issueCsrfCookie();
assertCsrf();

require_once __DIR__ . '/routes/api.php';
