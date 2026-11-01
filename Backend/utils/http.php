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

function h($value)
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}
