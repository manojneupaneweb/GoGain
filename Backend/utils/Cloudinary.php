<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Cloudinary\Cloudinary;

$cloudinary = new Cloudinary([
    'cloud' => [
        'cloud_name' => $_ENV['CLOUDINARY_CLOUD_NAME'],
        'api_key'    => $_ENV['CLOUDINARY_API_KEY'],
        'api_secret' => $_ENV['CLOUDINARY_API_SECRET'],
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
