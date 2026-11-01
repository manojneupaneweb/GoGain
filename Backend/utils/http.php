<?php

function respond($success, $message, $data = null, $status = 200)
{
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => (bool) $success,
        'message' => $message,
        'data' => $data,
    ]);
}

function registerExceptionHandler()
{
    set_exception_handler(function ($e) {
        error_log($e->getMessage());
        if (!headers_sent()) {
            http_response_code(500);
            header('Content-Type: application/json');
        }
        echo json_encode([
            'success' => false,
            'message' => 'Server error',
            'data' => null,
        ]);
    });
}

function pageParams()
{
    $page = max(1, (int) ($_GET['page'] ?? 1));
    $limit = (int) ($_GET['limit'] ?? 20);
    if ($limit < 1) {
        $limit = 20;
    }
    if ($limit > 50) {
        $limit = 50;
    }
    return [$page, $limit, ($page - 1) * $limit];
}

function h($value)
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}
