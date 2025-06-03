<?php
require 'vendor/autoload.php';

use Cloudinary\Cloudinary;

$cloudinary = new Cloudinary([
    'cloud' => [
        'cloud_name' => 'gogain',
        'api_key'    => '955313683614897',
        'api_secret' => 'pm6pb-ceo1ai2vgfXfGQ_7kY8E0',
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
