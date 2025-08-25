<?php
require_once __DIR__ . '/../utils/Cloudinary.php';
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../middleware/email.middleware.php';

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
            WHERE o.order_status = 'completed'
        ");
            $stmt->execute();
            $dashboardData['total_revenue'] = $stmt->fetch(PDO::FETCH_ASSOC)['total_revenue'] ?? 0;

            // 6. Recent orders (last 5)
            $stmt = $pdo->prepare("
            SELECT o.id, o.order_status, o.created_at, u.email as customer_email,
                   (p.price * o.quantity) as total_price
            FROM orders o
            JOIN users u ON o.user_id = u.id
            JOIN products p ON o.product_id = p.id
            ORDER BY o.created_at DESC
            LIMIT 5
        ");
            $stmt->execute();
            $dashboardData['recent_orders'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // 7. Order status counts
            $stmt = $pdo->prepare("
            SELECT 
                SUM(CASE WHEN order_status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
                SUM(CASE WHEN order_status = 'shipping' THEN 1 ELSE 0 END) as shipping_orders,
                SUM(CASE WHEN order_status = 'completed' THEN 1 ELSE 0 END) as completed_orders,
                SUM(CASE WHEN order_status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_orders
            FROM orders
        ");
            $stmt->execute();
            $dashboardData['order_status_counts'] = $stmt->fetch(PDO::FETCH_ASSOC);

            // 8. Top selling products (sum quantity grouped by product)
            $stmt = $pdo->prepare("
            SELECT p.id, p.name, p.price, SUM(o.quantity) as total_sold
            FROM orders o
            JOIN products p ON o.product_id = p.id
            WHERE o.order_status = 'completed'
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
            $stmt = $pdo->prepare("SELECT fullName, email, phone,  avatar, created_at, last_login FROM users WHERE role = 'user'");
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
            $reason = $data['cancelReason'] ?? null;

            if (!$orderId || !$status) {
                echo json_encode(['success' => false, 'message' => 'Missing required fields']);
                return;
            }

            // Update order status
            $stmt = $pdo->prepare("UPDATE orders SET order_status = ?, reason = ? WHERE id = ?");
            $stmt->execute([$status, $reason, $orderId]);

            // If status is delivered, fetch user and product info & send email
            if (strtolower($status) === 'delivered') {
                $stmt = $pdo->prepare("
                SELECT u.email, p.name AS product_name, p.price, p.description, o.quantity
                FROM orders o
                JOIN users u ON o.user_id = u.id
                JOIN products p ON o.product_id = p.id
                WHERE o.id = ?
            ");
                $stmt->execute([$orderId]);
                $orderInfo = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($orderInfo) {
                    $to = $orderInfo['email'];
                    $subject = "Your Order #$orderId has been Delivered!";

                    $messageBody = "
                    <html>
                    <body>
                        <h2>Order Delivered Successfully</h2>
                        <p>Hi, your order has been delivered. Here are the details:</p>
                        <table border='1' cellpadding='10' cellspacing='0' style='border-collapse: collapse;'>
                            <tr>
                                <th>Product Name</th>
                                <th>Description</th>
                                <th>Quantity</th>
                                <th>Price</th>
                            </tr>
                            <tr>
                                <td>{$orderInfo['product_name']}</td>
                                <td>{$orderInfo['description']}</td>
                                <td>{$orderInfo['quantity']}</td>
                                <td>Rs. {$orderInfo['price']}</td>
                            </tr>
                        </table>
                        <p>Thank you for shopping with us!</p>
                    </body>
                    </html>
                ";

                    sendMail($to, $subject, $messageBody);
                }
            }

            echo json_encode([
                'success' => true,
                'message' => 'Order status updated',
                'orderId' => $orderId,
                'status' => $status,
                'reason' => $reason,
            ]);
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

    public function activityHistory()
    {
        global $pdo;

        try {
            // Trainer check
            $trainer = $_SESSION['user_id'] ?? null;
            if (!$trainer) {
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Unauthorized']);
                return;
            }

            // Read request body
            $data = json_decode(file_get_contents("php://input"), true);
            $userId = $data['userId'];
            $date   = date('Y-m-d'); // just date, not full timestamp

            // First check if same user already has activity for today
            $checkStmt = $pdo->prepare("SELECT id FROM gym_user_activity WHERE userId = :userId AND DATE(date) = :date");
            $checkStmt->execute([
                ':userId' => $userId,
                ':date'   => $date,
            ]);
            $existing = $checkStmt->fetch(PDO::FETCH_ASSOC);

            if ($existing) {
                // Update if already exists
                $stmt = $pdo->prepare("
                UPDATE gym_user_activity 
                SET muscleGroup = :muscleGroup,
                    exercise = :exercise,
                    sets = :sets,
                    reps = :reps,
                    weight = :weight,
                    cardioMinutes = :cardioMinutes,
                    notes = :notes,
                    strengthProgress = :strengthProgress,
                    enduranceProgress = :enduranceProgress,
                    bodyFat = :bodyFat,
                    muscleMass = :muscleMass,
                    trainer = :trainer,
                    focus = :focus
                WHERE id = :id
            ");
                $stmt->execute([
                    ':muscleGroup'       => $data['muscleGroup'] ?? null,
                    ':exercise'          => $data['exercise'] ?? null,
                    ':sets'              => $data['sets'] ?? null,
                    ':reps'              => $data['reps'] ?? null,
                    ':weight'            => $data['weight'] ?? null,
                    ':cardioMinutes'     => $data['cardioMinutes'] ?? null,
                    ':notes'             => $data['notes'] ?? null,
                    ':strengthProgress'  => $data['strengthProgress'] ?? null,
                    ':enduranceProgress' => $data['enduranceProgress'] ?? null,
                    ':bodyFat'           => $data['bodyFat'] ?? null,
                    ':muscleMass'        => $data['muscleMass'] ?? null,
                    ':trainer'           => $trainer,
                    ':focus'             => $data['focus'] ?? null,
                    ':id'                => $existing['id'],
                ]);

                http_response_code(200);
                echo json_encode(['success' => true, 'message' => 'Activity updated successfully!']);
            } else {
                // Insert if not exists
                $stmt = $pdo->prepare("
                INSERT INTO gym_user_activity (
                    userId, date, muscleGroup, exercise, sets, reps, weight, cardioMinutes, notes, 
                    strengthProgress, enduranceProgress, bodyFat, muscleMass, trainer, focus, created_at
                ) VALUES (
                    :userId, :date, :muscleGroup, :exercise, :sets, :reps, :weight, :cardioMinutes, :notes, 
                    :strengthProgress, :enduranceProgress, :bodyFat, :muscleMass, :trainer, :focus, NOW()
                )
            ");
                $stmt->execute([
                    ':userId'            => $userId,
                    ':date'              => $date,
                    ':muscleGroup'       => $data['muscleGroup'] ?? null,
                    ':exercise'          => $data['exercise'] ?? null,
                    ':sets'              => $data['sets'] ?? null,
                    ':reps'              => $data['reps'] ?? null,
                    ':weight'            => $data['weight'] ?? null,
                    ':cardioMinutes'     => $data['cardioMinutes'] ?? null,
                    ':notes'             => $data['notes'] ?? null,
                    ':strengthProgress'  => $data['strengthProgress'] ?? null,
                    ':enduranceProgress' => $data['enduranceProgress'] ?? null,
                    ':bodyFat'           => $data['bodyFat'] ?? null,
                    ':muscleMass'        => $data['muscleMass'] ?? null,
                    ':trainer'           => $trainer,
                    ':focus'             => $data['focus'] ?? null,
                ]);

                http_response_code(201);
                echo json_encode(['success' => true, 'message' => 'Activity inserted successfully!']);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Database error', 'error' => $e->getMessage()]);
        }
    }

    public function getUserActivity()
    {
        global $pdo;

        try {
            // Check if user is logged in
            $userId = $_SESSION['user_id'] ?? null;
            if (!$userId) {
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Unauthorized']);
                return;
            }

            // Fetch user activities along with trainer info
            $stmt = $pdo->prepare("
            SELECT 
                a.id,
                a.date,
                a.muscleGroup,
                a.exercise,
                a.sets,
                a.reps,
                a.weight,
                a.cardioMinutes,
                a.notes,
                a.strengthProgress,
                a.enduranceProgress,
                a.bodyFat,
                a.muscleMass,
                a.trainer AS trainerId,
                a.focus,
                t.avatar AS trainerAvatar,
                t.fullName AS trainerFullName,
                t.email AS trainerEmail,
                t.phone AS trainerPhone
            FROM gym_user_activity a
            LEFT JOIN users t ON a.trainer = t.id
            WHERE a.userId = :userId
        ");

            $stmt->execute(['userId' => $userId]);
            $activity = $stmt->fetchAll(PDO::FETCH_ASSOC);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'User activities fetched successfully!',
                'data' => $activity,
                'userId' => $userId
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

    public function getAllOrders()
    {
        global $pdo;

        try {
            $userId = $_SESSION['user_id'] ?? null;
            if (!$userId) {
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Unauthorized']);
                return;
            }

            // get query params
            $status = $_GET['status'] ?? null;

            if ($status) {
                $stmt = $pdo->prepare("
                    SELECT 
                        o.id, o.order_status, o.quantity, o.total_price, o.created_at, o.reason,
                        u.id AS user_id, u.fullName, u.avatar, u.email, u.phone,
                        p.id AS product_id, p.name AS product_name, p.image AS product_image, p.price AS product_price
                    FROM orders o
                    JOIN users u ON o.user_id = u.id
                    JOIN products p ON o.product_id = p.id
                    WHERE o.order_status = ?
                ");
                $stmt->execute([$status]);
            } else {
                $stmt = $pdo->prepare("
                    SELECT 
                        o.id, o.order_status, o.created_at, o.reason,
                        u.id AS user_id, u.fullName, u.avatar, u.email, u.phone,
                        p.id AS product_id, p.name AS product_name, p.image AS product_image, p.price AS product_price
                    FROM orders o
                    JOIN users u ON o.user_id = u.id
                    JOIN products p ON o.product_id = p.id
                ");
                $stmt->execute();
            }

            $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'orders fetched successfully!',
                'data' => $orders,
                'status' => $status
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

    public function getReportData()
    {
        header('Content-Type: application/json');

        try {
            global $pdo; // your PDO connection

            // 1. Users summary
            $stmt = $pdo->query("SELECT COUNT(*) AS total_users, 
                                     SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) AS new_today 
                              FROM users");
            $users = $stmt->fetch(PDO::FETCH_ASSOC);

            // 2. Products summary
            $stmt = $pdo->query("SELECT COUNT(*) AS total_products, 
                                     SUM(price) AS total_value 
                              FROM products");
            $products = $stmt->fetch(PDO::FETCH_ASSOC);

            // 3. User plans summary
            $stmt = $pdo->query("SELECT plan_name, COUNT(*) AS total_users 
                              FROM user_plans 
                              GROUP BY plan_name");
            $plans = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // 4. Gym user daily activity summary (last 7 days)
            $stmt = $pdo->query("SELECT DATE(date) AS activity_date, 
                                     COUNT(*) AS total_exercises, 
                                     SUM(cardioMinutes) AS total_cardio_minutes
                              FROM gym_user_activity
                              WHERE DATE(date) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
                              GROUP BY DATE(date)
                              ORDER BY activity_date DESC");
            $dailyActivity = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // 5. Muscle group summary
            $stmt = $pdo->query("SELECT muscleGroup, COUNT(*) AS exercise_count
                              FROM gym_user_activity
                              GROUP BY muscleGroup
                              ORDER BY exercise_count DESC");
            $muscleGroups = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // 6. Strength & endurance progress (average)
            $stmt = $pdo->query("SELECT AVG(strengthProgress) AS avg_strength, 
                                     AVG(enduranceProgress) AS avg_endurance
                              FROM gym_user_activity");
            $progress = $stmt->fetch(PDO::FETCH_ASSOC);

            // 7. Top active users (by number of activities in last 7 days)
            $stmt = $pdo->query("SELECT u.id, u.fullName, COUNT(a.id) AS activity_count
                              FROM users u
                              JOIN gym_user_activity a ON u.id = a.userId
                              WHERE DATE(a.date) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
                              GROUP BY u.id
                              ORDER BY activity_count DESC
                              LIMIT 5");
            $topUsers = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Combine all
            $response = [
                'success' => true,
                'data' => [
                    'users' => $users,
                    'products' => $products,
                    'plans' => $plans,
                    'dailyActivity' => $dailyActivity,
                    'muscleGroups' => $muscleGroups,
                    'progress' => $progress,
                    'topUsers' => $topUsers
                ]
            ];

            echo json_encode($response);
        } catch (\Throwable $th) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Something went wrong',
                'error' => $th->getMessage()
            ]);
        }
    }
}
