<?php

function cookieSecure()
{
    return !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
}

function setTokenCookie($name, $value, $expires)
{
    setcookie($name, $value, [
        'expires' => $expires,
        'path' => '/',
        'secure' => cookieSecure(),
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
}

function clearTokenCookie($name)
{
    setcookie($name, '', [
        'expires' => time() - 3600,
        'path' => '/',
        'secure' => cookieSecure(),
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
}

function issueCsrfCookie()
{
    if (!empty($_COOKIE['csrf_token'])) {
        return;
    }

    $token = bin2hex(random_bytes(32));
    setcookie('csrf_token', $token, [
        'expires' => 0,
        'path' => '/',
        'secure' => cookieSecure(),
        'httponly' => false,
        'samesite' => 'Lax',
    ]);
    $_COOKIE['csrf_token'] = $token;
}

function assertCsrf()
{
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    if (in_array($method, ['GET', 'HEAD', 'OPTIONS'], true)) {
        return;
    }

    $cookie = $_COOKIE['csrf_token'] ?? '';
    $header = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if ($cookie === '' || $header === '' || !hash_equals($cookie, $header)) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid CSRF token',
        ]);
        exit;
    }
}

function setAuthCookies($accessToken, $accessTtl, $refreshToken, $refreshTtl)
{
    setTokenCookie('access_token', $accessToken, time() + $accessTtl);
    setTokenCookie('refresh_token', $refreshToken, time() + $refreshTtl);
}

function clearAuthCookies()
{
    clearTokenCookie('access_token');
    clearTokenCookie('refresh_token');
}
