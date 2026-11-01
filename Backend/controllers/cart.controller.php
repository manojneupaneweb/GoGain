<?php
require_once __DIR__ . '/../models/cart.model.php';
require_once __DIR__ . '/../utils/Cloudinary.php';
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../middleware/email.middleware.php';

require 'vendor/autoload.php';

use Ramsey\Uuid\Uuid;

class CartController
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }


    public function addToCart()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $user_id = authUserId();
        $product_id = $data['product_id'] ?? null;
        $quantity = isset($data['quantity']) ? (int) $data['quantity'] : 1;

        if (!$user_id || !$product_id || $quantity < 1) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing required fields.', 'data' => null]);
            return;
        }

        try {
            global $pdo;

            $productStmt = $pdo->prepare("SELECT price FROM products WHERE id = ?");
            $productStmt->execute([$product_id]);
            $product = $productStmt->fetch(PDO::FETCH_ASSOC);
            if (!$product) {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Product not found.', 'data' => null]);
                return;
            }
            $price = $product['price'];

            $stmt = $pdo->prepare("SELECT 1 FROM cart WHERE user_id = ? AND product_id = ?");
            $stmt->execute([$user_id, $product_id]);

            if ($stmt->fetch()) {
                http_response_code(200);
                echo json_encode(['success' => true, 'message' => 'Product already in cart', 'data' => null]);
                exit; // stop execution here
            }


            // Insert new item
            $id = substr(str_replace('-', '', Uuid::uuid4()->toString()), 0, 30);
            $insert = $pdo->prepare("INSERT INTO cart (id, user_id, product_id,  quantity, price) VALUES (?, ?, ?,?, ?)");
            $insert->execute([$id, $user_id,  $product_id, $quantity, $price,]);

            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Item added to cart',
                'data' => [
                    'id' => $id,
                    'user_id' => $user_id,
                    'product_id' => $product_id,
                    'quantity' => $quantity,
                    'price' => $price
                ]
            ]);
            exit;
        } catch (PDOException $e) {
            error_log($e->getMessage());
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Server error', 'data' => null]);
        }
    }

    public function GetCartItem()
    {
        header('Content-Type: application/json');

        if (!authUserId()) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Unauthorized login function']);
            return;
        }

        global $pdo;
        try {
            $userId = authUserId();
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
            WHERE cart.user_id = :user_id
        ");
            $stmt->execute(['user_id' => $userId]);

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
            exit;
        } catch (PDOException $e) {
            error_log($e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
            ]);
        }
    }

    public function updateCartQuantity($productId)
    {
        header('Content-Type: application/json');

        // Get logged-in user ID from session
        $user_id = authUserId();

        if (!$user_id) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Unauthorized. Please log in.'
            ]);
            return;
        }

        // Parse request body
        $data = json_decode(file_get_contents("php://input"), true);
        $quantity = isset($data['quantity']) ? intval($data['quantity']) : null;

        if (!$quantity || $quantity < 1) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid quantity. Must be a number greater than 0.'
            ]);
            return;
        }

        try {
            global $pdo;

            // Update quantity in cart
            $stmt = $pdo->prepare("UPDATE cart SET quantity = ?, update_at = NOW() WHERE user_id = ? AND product_id = ?");
            $stmt->execute([$quantity, $user_id, $productId]);

            if ($stmt->rowCount() > 0) {
                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'message' => 'Cart item updated successfully',
                    'data' => [
                        'product_id' => $productId,
                        'quantity' => $quantity
                    ]
                ]);
            } else {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Cart item not found or quantity unchanged'
                ]);
            }
        } catch (PDOException $e) {
            error_log($e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Database error occurred',
            ]);
        }
    }


    public function DeleteCartItem($product_id)
    {
        header('Content-Type: application/json');

        $user_id = authUserId();

        if (!$user_id || !$product_id) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Missing user or product ID.'
            ]);
            return;
        }

        try {
            global $pdo;

            // Check if item exists
            $checkStmt = $pdo->prepare("SELECT * FROM cart WHERE user_id = ? AND product_id = ?");
            $checkStmt->execute([$user_id, $product_id]);

            if (!$checkStmt->fetch()) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Item not found in cart.'
                ]);
                return;
            }

            // Delete item
            $deleteStmt = $pdo->prepare("DELETE FROM cart WHERE user_id = ? AND product_id = ?");
            $deleteStmt->execute([$user_id, $product_id]);

            if ($deleteStmt->rowCount() > 0) {
                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'message' => 'Item successfully removed from cart.'
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Failed to delete item from cart.'
                ]);
            }
            exit;
        } catch (PDOException $e) {
            error_log($e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Database error.',
            ]);
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

    public function createOrder()
    {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'An order is created only after payment is verified.'
        ]);
    }

    public function placePaidOrder($userId)
    {
        $cartItems = $this->lockedCart($userId);
        if (empty($cartItems)) {
            throw new Exception('Cart is empty');
        }

        $stmtUser = $this->pdo->prepare("SELECT fullName, email, delivery_address FROM users WHERE id = ? LIMIT 1");
        $stmtUser->execute([$userId]);
        $user = $stmtUser->fetch(PDO::FETCH_ASSOC);
        if (!$user) {
            throw new Exception('User not found');
        }

        $deliveryAddress = $user['delivery_address'] ?? '';
        $createdOrders = [];

        foreach ($cartItems as $item) {
            if ((int) $item['stock'] < (int) $item['quantity']) {
                throw new Exception('Not enough stock');
            }

            $totalPrice = $item['price'] * $item['quantity'];
            $id = $this->generateUUID();
            $stmt = $this->pdo->prepare("
                INSERT INTO orders
                    (id, user_id, product_id, quantity, total_price, payment_status, order_status, delivery_address)
                VALUES
                    (?, ?, ?, ?, ?, 'complete', 'pending', ?)
            ");
            $stmt->execute([
                $id,
                $userId,
                $item['product_id'],
                $item['quantity'],
                $totalPrice,
                $deliveryAddress
            ]);

            $stock = $this->pdo->prepare("UPDATE products SET stock = stock - ? WHERE id = ?");
            $stock->execute([$item['quantity'], $item['product_id']]);

            $createdOrders[] = [
                'order_id' => $id,
                'product_id' => $item['product_id'],
                'product_name' => $item['name'],
                'product_image' => $item['image'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
                'total' => $totalPrice
            ];
        }

        $this->deleteCartItemsByUser($userId);

        return [
            'user' => $user,
            'address' => $deliveryAddress,
            'orders' => $createdOrders
        ];
    }

    private function lockedCart($userId)
    {
        $stmt = $this->pdo->prepare("
            SELECT c.product_id, c.quantity, p.price, p.stock, p.name, p.image
            FROM cart c
            INNER JOIN products p ON p.id = c.product_id
            WHERE c.user_id = ?
            FOR UPDATE
        ");
        $stmt->execute([$userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function quoteCart($userId)
    {
        $stmt = $this->pdo->prepare("
            SELECT c.quantity, p.price
            FROM cart c
            INNER JOIN products p ON p.id = c.product_id
            WHERE c.user_id = ?
        ");
        $stmt->execute([$userId]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if (!$rows) {
            return null;
        }

        $subtotal = 0;
        foreach ($rows as $row) {
            $subtotal += $row['price'] * $row['quantity'];
        }

        // Same shipping rule as the cart page.
        $shipping = $subtotal > 100 ? 0 : 10;
        return $subtotal + $shipping;
    }


    public function getCartItemsByUser($userId)
    {
        $sql = "SELECT product_id, quantity, price FROM cart WHERE user_id = :user_id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function deleteCartItemsByUser($userId)
    {
        $sql = "DELETE FROM cart WHERE user_id = :user_id";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute(['user_id' => $userId]);
    }

    public function generateUUID()
    {
        $data = random_bytes(16);
        $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }

}




class PlanController
{
    private $pdo;
    public function __construct($db)
    {
        $this->pdo = $db;
    }

    public function createPlan()
    {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'A plan is created only after payment is verified.'
        ]);
    }

    public function placePaidPlan($userId, array $plan)
    {
        $today = date('Y-m-d');
        $now = date('Y-m-d H:i:s');
        $days = (int) $plan['days'];
        $planName = $plan['name'];

        $stmt = $this->pdo->prepare("
            SELECT id, plan_name, start_date, expire_date
            FROM user_plans
            WHERE user_id = ?
            ORDER BY expire_date DESC
            LIMIT 1
            FOR UPDATE
        ");
        $stmt->execute([$userId]);
        $lastPlan = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($lastPlan && $lastPlan['plan_name'] === $planName) {
            $newExpireDate = date('Y-m-d', strtotime($lastPlan['expire_date'] . " +{$days} days"));
            $update = $this->pdo->prepare("
                UPDATE user_plans
                SET expire_date = ?, updated_at = ?
                WHERE id = ?
            ");
            $update->execute([$newExpireDate, $now, $lastPlan['id']]);
            return [
                'plan_name' => $planName,
                'start_date' => $lastPlan['start_date'],
                'expire_date' => $newExpireDate
            ];
        }

        if ($lastPlan) {
            $this->pdo->prepare("DELETE FROM user_plans WHERE user_id = ?")->execute([$userId]);
        }

        $newExpireDate = date('Y-m-d', strtotime("+{$days} days"));
        $id = substr(str_replace('-', '', \Ramsey\Uuid\Uuid::uuid4()->toString()), 0, 30);
        $insert = $this->pdo->prepare("
            INSERT INTO user_plans (id, user_id, plan_name, start_date, expire_date, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        $insert->execute([$id, $userId, $planName, $today, $newExpireDate, $now, $now]);

        return [
            'id' => $id,
            'plan_name' => $planName,
            'start_date' => $today,
            'expire_date' => $newExpireDate
        ];
    }
}
