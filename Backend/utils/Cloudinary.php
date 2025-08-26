<?php
require __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

use Cloudinary\Cloudinary;
use Dotenv\Dotenv;

$cloudinary = new Cloudinary([
    'cloud' => [
        'cloud_name' => $_ENV['CLOUDENIRAY_cloud_name'],
        'api_key'    => $_ENV['CLOUDENIRAY_api_key'],
        'api_secret' => $_ENV['CLOUDENIRAY_api_secret'],
    ],
]);

function uploadOnCloudinary($file)
{
    global $cloudinary;

    try {
        $upload = $cloudinary->uploadApi()->upload($file, [
            'folder' => 'avatars'
        ]);
        return $upload['secure_url'];
    } catch (Exception $e) {
        throw new Exception('Upload failed: ' . $e->getMessage());
    }
}
