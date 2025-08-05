<?php
require_once __DIR__ . '/../models/cart.model.php';
require_once __DIR__ . '/../utils/Cloudinary.php';
require_once __DIR__ . '/../config/db.php';

require 'vendor/autoload.php';
use Ramsey\Uuid\Uuid;

class CartController
{
    public function addToCart()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $user_id = $data['user_id'] ?? null;
        $product_id = $data['product_id'] ?? null;
        $quantity = $data['quantity'] ?? 1;

        if (!$user_id || !$product_id) {
            http_response_code(400);
            echo json_encode(['message' => 'Missing required fields.']);
            return;
        }

        try {
            global $pdo;

            $checkStmt = $pdo->prepare("SELECT * FROM cart WHERE user_id = ? AND product_id = ?");
            $checkStmt->execute([$user_id, $product_id]);
            $existing = $checkStmt->fetch();

            if ($existing) {
                http_response_code(200);
                echo json_encode(['message' => 'Product already in cart']);
                return;
            }

            $id = substr(str_replace('-', '', Uuid::uuid4()->toString()), 0, 30);
            $stmt = $pdo->prepare("INSERT INTO cart (id, user_id, product_id, quantity) VALUES (?, ?, ?, ?)");
            $stmt->execute([$id, $user_id, $product_id, $quantity]);

            http_response_code(201);
            echo json_encode(['message' => 'Item added to cart']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
    public function GetCartItem()
    {
        session_start(); // Ensure session is started

        $user_id = $_SESSION['user_id'] ?? null;

        if (!$user_id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'User ID is required']);
            return;
        }

        try {
            global $pdo;

            // Join cart with products to fetch product details
            $stmt = $pdo->prepare("
            SELECT 
                cart.id AS cart_id,
                cart.quantity,
                cart.product_id,
                products.name,
                products.description,
                products.price,
                products.category,
                products.image,
                (cart.quantity * products.price) AS total_price
            FROM cart
            INNER JOIN products ON cart.product_id = products.id
        ");

            $stmt->execute();
            $cartItems = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Calculate cart summary
            $subtotal = 0;
            foreach ($cartItems as $item) {
                $subtotal += $item['total_price'];
            }

            echo json_encode([
                'success' => true,
                'message' => 'Cart fetched successfully',
                'data' => [
                    'items' => $cartItems,
                    'summary' => [
                        'subtotal' => $subtotal,
                        'item_count' => count($cartItems)
                    ]
                ]
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }

    public function updateCartQuantity($productId)
    {
        // Get user_id from session (or decode from token if you're using JWT)
        $user_id = $_SESSION['user_id'] ?? null;

        if (!$user_id) {
            http_response_code(401);
            echo json_encode(['message' => 'Unauthorized: User not logged in']);
            return;
        }

        // Read request body
        $data = json_decode(file_get_contents("php://input"), true);
        $quantity = $data['quantity'] ?? null;

        if (!$quantity || !is_numeric($quantity) || $quantity < 1) {
            http_response_code(400);
            echo json_encode(['message' => 'Invalid quantity']);
            return;
        }

        try {
            global $pdo;

            // Prepare and execute update query
            $stmt = $pdo->prepare("UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?");
            $stmt->execute([$quantity, $user_id, $productId]);

            if ($stmt->rowCount() > 0) {
                http_response_code(200);
                echo json_encode(['success' => true, 'message' => 'Cart item updated successfully']);
            } else {
                // No row was affected — likely wrong user_id or product_id
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Cart item not found or already updated']);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }





}

class OrderController
{
    private $pdo;

    public function __construct($db)
    {
        $this->pdo = $db;
    }

    public function createOrder(array $orderItems)
    {
        $now = date('Y-m-d H:i:s');

        $this->pdo->beginTransaction();

        try {
            $stmt = $this->pdo->prepare("
            INSERT INTO orders 
            (id, user_id, product_id, quantity, payment_status, order_status, createdAt, updatedAt, address)
            VALUES 
            (:id, :user_id, :product_id, :quantity, :payment_status, :order_status, :createdAt, :updatedAt, :address)
        ");

            foreach ($orderItems as $data) {
                if (empty($data['user_id']) || empty($data['product_id']) || empty($data['quantity'])) {
                    $this->pdo->rollBack();
                    return [
                        'success' => false,
                        'message' => 'Missing required order data for one or more items',
                    ];
                }

                $id = substr(str_replace('-', '', Uuid::uuid4()->toString()), 0, 30);
                $user_id = $data['user_id'];
                $product_id = $data['product_id'];
                $quantity = $data['quantity'];
                $payment_status = 'complete';
                $order_status = 'pending';
                $address = null;

                $stmt->bindParam(':id', $id);
                $stmt->bindParam(':user_id', $user_id);
                $stmt->bindParam(':product_id', $product_id);
                $stmt->bindParam(':quantity', $quantity);
                $stmt->bindParam(':payment_status', $payment_status);
                $stmt->bindParam(':order_status', $order_status);
                $stmt->bindParam(':createdAt', $now);
                $stmt->bindParam(':updatedAt', $now);
                $stmt->bindParam(':address', $address);

                $stmt->execute();
            }

            $this->pdo->commit();

            return [
                'success' => true,
                'message' => 'All orders created successfully',
                'data' => $orderItems,
            ];

        } catch (Exception $e) {
            $this->pdo->rollBack();
            return [
                'success' => false,
                'message' => 'Error creating orders: ' . $e->getMessage(),
            ];
        }
    }




}




class PlanController
{

    public function __construct($db)
    {
        $this->pdo = $db;
    }

    public function createPlan(array $planItems)
    {
        $now = date('Y-m-d H:i:s');

        $this->pdo->beginTransaction();

        try {
            $stmt = $this->pdo->prepare(" 
            INSERT INTO user_plans 
            (id, user_id, plan_name, start_date, expire_date, created_at)
            VALUES 
            (:id, :user_id, :plan_name, :start_date, :expire_date, :created_at)
        ");

            foreach ($planItems as $item) {
                if (empty($item['user_id']) || empty($item['plan_name'])) {
                    $this->pdo->rollBack();
                    return [
                        'success' => false,
                        'message' => 'Missing user_id or plan_name in one or more items',
                    ];
                }

                $id = substr(str_replace('-', '', Uuid::uuid4()->toString()), 0, 30);
                $user_id = $item['user_id'];
                $plan_name = $item['plan_name'];
                $start_date = date('Y-m-d');

                // Calculate expire date based on plan_name
                $expire_date = match ($plan_name) {
                    '1 Month' => date('Y-m-d', strtotime("+30 days")),
                    '3 Months' => date('Y-m-d', strtotime("+90 days")),
                    '6 Months' => date('Y-m-d', strtotime("+180 days")),
                    '1 Year' => date('Y-m-d', strtotime("+365 days")),
                    default => date('Y-m-d', strtotime("+30 days")),
                };

                $stmt->bindParam(':id', $id);
                $stmt->bindParam(':user_id', $user_id);
                $stmt->bindParam(':plan_name', $plan_name);
                $stmt->bindParam(':start_date', $start_date);
                $stmt->bindParam(':expire_date', $expire_date);
                $stmt->bindParam(':created_at', $now);

                $stmt->execute();
            }

            $this->pdo->commit();

            return [
                'success' => true,
                'message' => 'Plan(s) created successfully',
                'data' => $planItems,
            ];

        } catch (Exception $e) {
            $this->pdo->rollBack();
            return [
                'success' => false,
                'message' => 'Error creating plan(s): ' . $e->getMessage(),
            ];
        }
    }


}
?>