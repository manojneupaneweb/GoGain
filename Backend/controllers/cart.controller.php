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
            $id = Uuid::uuid4()->toString();
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
            $stmt = $pdo->prepare("UPDATE cart SET quantity = ?, updated_at = NOW() WHERE user_id = ? AND product_id = ?");
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
