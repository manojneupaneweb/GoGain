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
            error_log($e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Database error',
            ]);
        }
    }

    public function getAllUsers()
    {
        global $pdo;

        try {
            // Get current user ID from token
            $currentUserId = authUserId();

            // Get all users
            [$page, $limit, $offset] = pageParams();
            $total = (int) $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
            $stmt = $pdo->query("SELECT id, fullName, email, avatar, role FROM users ORDER BY created_at DESC LIMIT {$limit} OFFSET {$offset}");
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Users loaded',
                'data' => [
                    'users' => $users,
                    'currentUserId' => $currentUserId,
                    'page' => $page,
                    'limit' => $limit,
                    'total' => $total,
                ]
            ]);
        } catch (PDOException $e) {
            error_log($e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Database error',
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
            $allowedRoles = ['user', 'trainer', 'admin'];
            if (!in_array($newRole, $allowedRoles, true)) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Role must be user, trainer, or admin'
                ]);
                return;
            }

            $stmt = $pdo->prepare("SELECT id, role FROM users WHERE id = ?");
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
            error_log($e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Database error',
            ]);
        }
    }

    public function getAllUserInformation()
    {
        global $pdo;

        try {
            // Get all users with their information
            [$page, $limit, $offset] = pageParams();
            $count = $pdo->prepare("SELECT COUNT(*) FROM users WHERE role = 'user'");
            $count->execute();
            $total = (int) $count->fetchColumn();
            $stmt = $pdo->query("SELECT fullName, email, phone, avatar, created_at, last_login FROM users WHERE role = 'user' ORDER BY created_at DESC LIMIT {$limit} OFFSET {$offset}");
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Customers loaded',
                'data' => [
                    'items' => $users,
                    'page' => $page,
                    'limit' => $limit,
                    'total' => $total,
                ],
            ]);
        } catch (PDOException $e) {
            error_log($e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Database error',
            ]);
        }
    }

    public function changeOrderStatus()
    {
        global $pdo;

        header('Content-Type: application/json');

        try {
            $data = json_decode(file_get_contents("php://input"), true);

            $orderId = $data['orderId'] ?? null;
            $status = $data['status'] ?? null;
            $reason = $data['cancelReason'] ?? null;

            if (!$orderId || !$status) {
                echo json_encode([
                    'success' => false,
                    'message' => 'Missing required fields: orderId or status'
                ]);
                return;
            }

            // ✅ Update order status in the database
            $stmt = $pdo->prepare("UPDATE orders SET order_status = ?, reason = ? WHERE id = ?");
            $stmt->execute([$status, $reason, $orderId]);

            // ✅ Send delivery email if status is delivered
            if (strtolower($status) === 'delivered') {
                $stmt = $pdo->prepare("
                SELECT u.email, u.delivery_address, p.name AS product_name, p.price, p.description, o.quantity
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
                    <p>Hi, your order has been delivered to <strong>" . h($orderInfo['delivery_address']) . "</strong>. Here are the details:</p>
                    <table border='1' cellpadding='10' cellspacing='0' style='border-collapse: collapse;'>
                        <tr>
                            <th>Product Name</th>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                        <tr>
                            <td>" . h($orderInfo['product_name']) . "</td>
                            <td>" . h($orderInfo['description']) . "</td>
                            <td>" . h($orderInfo['quantity']) . "</td>
                            <td>Rs. " . h($orderInfo['price']) . "</td>
                        </tr>
                    </table>
                    <p>Thank you for shopping with us!</p>
                </body>
                </html>
                ";

                    sendMail($to, $subject, $messageBody);
                }
            }

            // ✅ Return JSON response
            echo json_encode([
                'success' => true,
                'message' => 'Order status updated successfully',
                'orderId' => $orderId,
                'status' => $status,
                'reason' => $reason,
            ]);
        } catch (Exception $e) {
            error_log($e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Server error',
            ]);
        }
    }

    public function getAllUserPlans()
    {
        global $pdo;

        try {
            // Get all users with their information
            [$page, $limit, $offset] = pageParams();
            $total = (int) $pdo->query("SELECT COUNT(*) FROM user_plans")->fetchColumn();
            $stmt = $pdo->query("SELECT id, user_id, plan_name, start_date, expire_date, created_at FROM user_plans ORDER BY created_at DESC LIMIT {$limit} OFFSET {$offset}");
            $plans = $stmt->fetchAll(PDO::FETCH_ASSOC);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Plans loaded',
                'data' => [
                    'items' => $plans,
                    'page' => $page,
                    'limit' => $limit,
                    'total' => $total,
                ],
            ]);
        } catch (PDOException $e) {
            error_log($e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Database error',
            ]);
        }
    }

    public function activityHistory()
    {
        global $pdo;

        try {
            // Trainer check
            $trainer = authUserId();
            if (!$trainer) {
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Unauthorized']);
                return;
            }

            $data = json_decode(file_get_contents("php://input"), true);
            $userId = authUserId();
            $date   = date('Y-m-d');

            // First check if same user already has activity for today
            $checkStmt = $pdo->prepare("SELECT id FROM gym_user_activity WHERE user_id = :userId AND activity_date = :date");
            $checkStmt->execute([
                ':userId' => $userId,
                ':date'   => $date,
            ]);
            $existing = $checkStmt->fetch(PDO::FETCH_ASSOC);

            if ($existing) {
                // Update if already exists
                $stmt = $pdo->prepare("
                UPDATE gym_user_activity
                SET muscle_group = :muscleGroup,
                    exercise = :exercise,
                    sets = :sets,
                    reps = :reps,
                    weight = :weight,
                    cardio_minutes = :cardioMinutes,
                    notes = :notes,
                    strength_progress = :strengthProgress,
                    endurance_progress = :enduranceProgress,
                    body_fat = :bodyFat,
                    muscle_mass = :muscleMass,
                    trainer_id = :trainer,
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
                    user_id, activity_date, muscle_group, exercise, sets, reps, weight, cardio_minutes, notes,
                    strength_progress, endurance_progress, body_fat, muscle_mass, trainer_id, focus, created_at
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
            error_log($e->getMessage());
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Database error', 'message' => 'Server error']);
        }
    }

    public function getUserActivity()
    {
        global $pdo;

        try {
            // Check if user is logged in
            $userId = authUserId();
            if (!$userId) {
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Unauthorized']);
                return;
            }

            // Fetch user activities along with trainer info
            $stmt = $pdo->prepare("
            SELECT 
                a.id,
                a.activity_date AS date,
                a.muscle_group AS muscleGroup,
                a.exercise,
                a.sets,
                a.reps,
                a.weight,
                a.cardio_minutes AS cardioMinutes,
                a.notes,
                a.strength_progress AS strengthProgress,
                a.endurance_progress AS enduranceProgress,
                a.body_fat AS bodyFat,
                a.muscle_mass AS muscleMass,
                a.trainer_id AS trainerId,
                a.focus,
                t.avatar AS trainerAvatar,
                t.fullName AS trainerFullName,
                t.email AS trainerEmail,
                t.phone AS trainerPhone
            FROM gym_user_activity a
            LEFT JOIN users t ON a.trainer_id = t.id
            WHERE a.user_id = :userId
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
            error_log($e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Database error',
            ]);
        }
    }

    public function getAllOrders()
    {
        global $pdo;

        try {
            $userId = authUserId();
            if (!$userId) {
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Unauthorized']);
                return;
            }

            // get query params
            [$page, $limit, $offset] = pageParams();
            $status = $_GET['status'] ?? null;
            $where = '';
            $params = [];
            if ($status) {
                $where = 'WHERE o.order_status = ?';
                $params[] = $status;
            }

            $count = $pdo->prepare("SELECT COUNT(*) FROM orders o $where");
            $count->execute($params);
            $total = (int) $count->fetchColumn();

            $stmt = $pdo->prepare("
                SELECT
                    o.id, o.order_status, o.quantity, o.total_price, o.delivery_address, o.created_at, o.reason,
                    u.id AS user_id, u.fullName, u.avatar, u.email, u.phone,
                    p.id AS product_id, p.name AS product_name, p.image AS product_image, p.price AS product_price
                FROM orders o
                JOIN users u ON o.user_id = u.id
                JOIN products p ON o.product_id = p.id
                $where
                ORDER BY o.created_at DESC
                LIMIT {$limit} OFFSET {$offset}
            ");
            $stmt->execute($params);
            $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'orders fetched successfully!',
                'data' => [
                    'items' => $orders,
                    'page' => $page,
                    'limit' => $limit,
                    'total' => $total,
                ],
            ]);
        } catch (PDOException $e) {
            error_log($e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Database error',
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
            $stmt = $pdo->query("SELECT activity_date,
                                     COUNT(*) AS total_exercises,
                                     SUM(cardio_minutes) AS total_cardio_minutes
                              FROM gym_user_activity
                              WHERE activity_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
                              GROUP BY activity_date
                              ORDER BY activity_date DESC");
            $dailyActivity = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // 5. Muscle group summary
            $stmt = $pdo->query("SELECT muscle_group AS muscleGroup, COUNT(*) AS exercise_count
                              FROM gym_user_activity
                              GROUP BY muscle_group
                              ORDER BY exercise_count DESC");
            $muscleGroups = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // 6. Strength & endurance progress (average)
            $stmt = $pdo->query("SELECT AVG(strength_progress) AS avg_strength,
                                     AVG(endurance_progress) AS avg_endurance
                              FROM gym_user_activity");
            $progress = $stmt->fetch(PDO::FETCH_ASSOC);

            // 7. Top active users (by number of activities in last 7 days)
            $stmt = $pdo->query("SELECT u.id, u.fullName, COUNT(a.id) AS activity_count
                              FROM users u
                              JOIN gym_user_activity a ON u.id = a.user_id
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
            ]);
        }
    }
}
