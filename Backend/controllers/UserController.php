<?php
require_once __DIR__ . '/../models/user.model.php';

class UserController {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function registerUser() {
        header('Content-Type: application/json');
        echo json_encode(['message' => 'User registered successfully']);

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['message' => 'Method not allowed']);
            return;
        }

        $data = json_decode(file_get_contents('php://input'), true);
        echo json_encode($data);
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(['message' => 'Invalid JSON data']);
            return;
        }

        // Validate required fields
        if (empty($data['fullName']) || empty($data['email']) || empty($data['password'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Full name, email, and password are required']);
            return;
        }

       
    }

    public function loginUser() {
        header('Content-Type: application/json');

        // Check request method
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['message' => 'Method not allowed']);
            return;
        }

        // Get and validate JSON input
        $data = json_decode(file_get_contents('php://input'), true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(['message' => 'Invalid JSON data']);
            return;
        }

        // Validate required fields
        if (empty($data['email']) || empty($data['password'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Email and password are required']);
            return;
        }
    }
}