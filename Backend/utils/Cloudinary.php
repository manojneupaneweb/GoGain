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

    if (!is_file($file)) {
        throw new Exception('Upload failed');
    }

    $size = filesize($file);
    if ($size === false || $size > 2 * 1024 * 1024) {
        throw new Exception('Image must be 2MB or smaller');
    }

    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file);
    $allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!in_array($mime, $allowed, true)) {
        throw new Exception('Only JPEG, PNG, and WEBP images are allowed');
    }

    try {
        $upload = $cloudinary->uploadApi()->upload($file, [
            'folder' => 'avatars',
            'public_id' => bin2hex(random_bytes(16)),
        ]);
        return $upload['secure_url'];
    } catch (Exception $e) {
        error_log($e->getMessage());
        throw new Exception('Upload failed');
    }
}
