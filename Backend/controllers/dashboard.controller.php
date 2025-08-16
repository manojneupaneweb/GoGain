<?php
require_once __DIR__ . '/../utils/Cloudinary.php';
require_once __DIR__ . '/../config/db.php';

require 'vendor/autoload.php';
use Ramsey\Uuid\Uuid;

class DashboardController
{
    private $pdo;
    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }
    public function GetDashboard()
    {
        global $pdo;

        try {
            $dashboardData = [];

            // 1. Total users (role = 'user')
            $stmt = $pdo->prepare("SELECT COUNT(*) as total_users FROM users WHERE role = 'user'");
            $stmt->execute();
            $dashboardData['total_users'] = $stmt->fetch(PDO::FETCH_ASSOC)['total_users'];

            // 2. Total admins
            $stmt = $pdo->prepare("SELECT COUNT(*) as total_admins FROM users WHERE role = 'admin'");
            $stmt->execute();
            $dashboardData['total_admins'] = $stmt->fetch(PDO::FETCH_ASSOC)['total_admins'];

            // 3. Total products
            $stmt = $pdo->prepare("SELECT COUNT(*) as total_products FROM products");
            $stmt->execute();
            $dashboardData['total_products'] = $stmt->fetch(PDO::FETCH_ASSOC)['total_products'];

            // 4. Total products sold (sum quantity from completed orders)
            $stmt = $pdo->prepare("SELECT SUM(quantity) as total_sold FROM orders WHERE order_status = 'completed'");
            $stmt->execute();
            $dashboardData['total_products_sold'] = $stmt->fetch(PDO::FETCH_ASSOC)['total_sold'] ?? 0;

            // 5. Total revenue (sum product price * quantity from orders join products)
            $stmt = $pdo->prepare("
            SELECT SUM(p.price * o.quantity) as total_revenue
            FROM orders o
            JOIN products p ON o.product_id = p.id
            WHERE o.order_status = 'complete'
        ");
            $stmt->execute();
            $dashboardData['total_revenue'] = $stmt->fetch(PDO::FETCH_ASSOC)['total_revenue'] ?? 0;

            // 6. Recent orders (last 5)
            $stmt = $pdo->prepare("
            SELECT o.id, o.order_status, o.createdAt, u.email as customer_email,
                   (p.price * o.quantity) as total_price
            FROM orders o
            JOIN users u ON o.user_id = u.id
            JOIN products p ON o.product_id = p.id
            ORDER BY o.createdAt DESC
            LIMIT 5
        ");
            $stmt->execute();
            $dashboardData['recent_orders'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // 7. Order status counts
            $stmt = $pdo->prepare("
            SELECT 
                SUM(CASE WHEN order_status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
                SUM(CASE WHEN order_status = 'shipping' THEN 1 ELSE 0 END) as shipping_orders,
                SUM(CASE WHEN order_status = 'complete' THEN 1 ELSE 0 END) as completed_orders,
                SUM(CASE WHEN order_status = 'cancel' THEN 1 ELSE 0 END) as cancelled_orders
            FROM orders
        ");
            $stmt->execute();
            $dashboardData['order_status_counts'] = $stmt->fetch(PDO::FETCH_ASSOC);

            // 8. Top selling products (sum quantity grouped by product)
            $stmt = $pdo->prepare("
            SELECT p.id, p.name, p.price, SUM(o.quantity) as total_sold
            FROM orders o
            JOIN products p ON o.product_id = p.id
            WHERE o.order_status = 'complete'
            GROUP BY p.id
            ORDER BY total_sold DESC
            LIMIT 5
        ");
            $stmt->execute();
            $dashboardData['top_products'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Send response
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $dashboardData
            ]);

        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Database error',
                'error' => $e->getMessage()
            ]);
        }
    }


    public function getAllUsers()
    {
        global $pdo;

        try {
            // Get current user ID from token
            $currentUserId = $_SESSION['user_id'];

            // Get all users
            $stmt = $pdo->prepare("SELECT id, fullName, email, avatar,  role FROM users");
            $stmt->execute();
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => [
                    'users' => $users,
                    'currentUserId' => $currentUserId
                ]
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Database error',
                'error' => $e->getMessage()
            ]);
        }
    }
    public function ChangeRole()
    {
        global $pdo;

        try {
            // Get JSON input
            $data = json_decode(file_get_contents("php://input"), true);

            // Validate input
            if (!isset($data['userId']) || !isset($data['role'])) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'userId and role are required'
                ]);
                return;
            }

            $userId = $data['userId'];
            $newRole = $data['role'];

            // Check if user exists
            $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
            $stmt->execute([$userId]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$user) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'User not found'
                ]);
                return;
            }

            // Update role
            $stmt = $pdo->prepare("UPDATE users SET role = ? WHERE id = ?");
            $stmt->execute([$newRole, $userId]);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'User role updated successfully'
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Database error',
                'error' => $e->getMessage()
            ]);
        }
    }

    public function ChangePassword()
    {
        global $pdo;

        // Get the raw JSON input
        $data = json_decode(file_get_contents("php://input"), true);

        $userId = $_SESSION['user_id'];

        if (!$userId) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Unauthorized'
            ]);
            return;
        }

        $currentPassword = $data['currentPassword'] ?? '';
        $newPassword = $data['newPassword'] ?? '';
        $confirmPassword = $data['confirmPassword'] ?? '';

        // Basic validation
        if (!$currentPassword || !$newPassword || !$confirmPassword) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'All fields are required'
            ]);
            return;
        }

        if ($newPassword !== $confirmPassword) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'New password and confirmation do not match'
            ]);
            return;
        }

        try {
            // Fetch user from DB
            $stmt = $pdo->prepare("SELECT password FROM users WHERE id = ?");
            $stmt->execute([$userId]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$user || !password_verify($currentPassword, $user['password'])) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Current password is incorrect'
                ]);
                return;
            }

            $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

            $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
            $stmt->execute([$hashedPassword, $userId]);

            echo json_encode([
                'success' => true,
                'message' => 'Password changed successfully'
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Database error',
                'error' => $e->getMessage()
            ]);
        }
    }

    public function getAllUserInformation()
    {
        global $pdo;

        try {
            // Get all users with their information
            $stmt = $pdo->prepare("SELECT fullName, email, phone, address, date_of_birth, avatar, created_at, last_login FROM users WHERE role = 'user' OR role = 'trainer'");
            $stmt->execute();
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $users
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Database error',
                'error' => $e->getMessage()
            ]);
        }
    }


    public function changeOrderStatus()
    {
        global $pdo;
        try {
            $data = json_decode(file_get_contents("php://input"), true);

            $orderId = $data['orderId'] ?? null;
            $status = $data['status'] ?? null;

            if (!$orderId || !$status) {
                echo json_encode(['success' => false, 'message' => 'Missing required fields']);
                return;
            }
            // Update the order status
            $stmt = $pdo->prepare("UPDATE orders SET order_status = ? WHERE id = ?");
            $stmt->execute([$status, $orderId]);

            echo json_encode(['success' => true, 'message' => 'Order status updated']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Server error',
                'error' => $e->getMessage()
            ]);
        }
    }

public function getAllUserPlans()
    {
        global $pdo;

        try {
            // Get all users with their information
            $stmt = $pdo->prepare("SELECT id, user_id, plan_name, start_date, expire_date, created_at FROM user_plans");
            $stmt->execute();
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $users
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Database error',
                'error' => $e->getMessage()
            ]);
        }
    }







}
