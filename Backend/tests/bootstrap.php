<?php

$_ENV['CLOUDINARY_CLOUD_NAME'] = 'test';
$_ENV['CLOUDINARY_API_KEY'] = 'test';
$_ENV['CLOUDINARY_API_SECRET'] = 'test';
$_ENV['MAIL_USER'] = 'test@gogain.test';
$_ENV['MAIL_PASSWORD'] = 'test';

require_once __DIR__ . '/../utils/http.php';
require_once __DIR__ . '/../utils/otp.php';
require_once __DIR__ . '/../utils/rate_limit.php';
require_once __DIR__ . '/../controllers/pay.controller.php';
require_once __DIR__ . '/../controllers/order.controller.php';
require_once __DIR__ . '/../middleware/auth.middleware.php';
require_once __DIR__ . '/../controllers/UserController.php';

function testPdo()
{
    $pdo = new PDO('sqlite::memory:');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $pdo;
}
