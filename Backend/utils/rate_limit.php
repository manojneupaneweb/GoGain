<?php

function rateLimit($bucket, $limit, $windowSeconds)
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $file = sys_get_temp_dir() . '/gogain-rl-' . hash('sha256', $bucket . '|' . $ip);
    $now = time();
    $hits = [];

    if (is_file($file)) {
        $decoded = json_decode((string) file_get_contents($file), true);
        if (is_array($decoded)) {
            $hits = $decoded;
        }
    }

    $hits = array_values(array_filter($hits, function ($timestamp) use ($now, $windowSeconds) {
        return $timestamp > $now - $windowSeconds;
    }));

    if (count($hits) >= $limit) {
        respond(false, 'Too many requests. Try again later.', null, 429);
        exit;
    }

    $hits[] = $now;
    file_put_contents($file, json_encode($hits), LOCK_EX);
}
