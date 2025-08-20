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
        $user_id = $_SESSION['user_id'] ?? 1;
        $product_id = $data['product_id'] ?? null;
        $quantity = $data['quantity'] ?? 1;
        $price = $data['price'] ?? 1;

        if (!$user_id || !$product_id) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Missing required fields.']);
            return;
        }

        try {
            global $pdo;

            // Check if item already exists in cart
            $stmt = $pdo->prepare("SELECT 1 FROM cart WHERE user_id = ? AND product_id = ?");
            $stmt->execute([$user_id, $product_id]);

            if ($stmt->fetch()) {
                http_response_code(200);
                echo json_encode(['status' => 'info', 'message' => 'Product already in cart']);
                exit; // stop execution here
            }


            // Insert new item
            $id = substr(str_replace('-', '', Uuid::uuid4()->toString()), 0, 30);
            $insert = $pdo->prepare("INSERT INTO cart (id, user_id, product_id,  quantity, price) VALUES (?, ?, ?,?, ?)");
            $insert->execute([$id, $user_id,  $product_id, $quantity, $price,]);

            http_response_code(201);
            echo json_encode([
                'status' => 'success',
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
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Server error', 'details' => $e->getMessage()]);
        }
    }

    public function GetCartItem()
    {
        header('Content-Type: application/json');

        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Unauthorized login function']);
            return;
        }

        global $pdo;
        try {
            $userId = $_SESSION['user_id'];
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
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }

    public function updateCartQuantity($productId)
    {
        header('Content-Type: application/json');

        // Get logged-in user ID from session
        $user_id = $_SESSION['user_id'] ?? null;

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
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Database error occurred',
                'error' => $e->getMessage()
            ]);
        }
    }


    public function DeleteCartItem($product_id)
    {
        header('Content-Type: application/json');

        $user_id = $_SESSION['user_id'] ?? null;

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
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Database error.',
                'error' => $e->getMessage()
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
        session_start();

        try {
            $input = json_decode(file_get_contents('php://input'), true);
            if (!$input) {
                throw new Exception("Invalid input data");
            }

            $userId = $_SESSION['user_id'] ?? null;
            if (!$userId) {
                throw new Exception("User not logged in");
            }

            $paymentStatus = $input['payment_status'] ?? 'complete';
            $orderStatus   = $input['order_status'] ?? 'pending';

            $cartItems = $this->getCartItemsByUser($userId);
            if (empty($cartItems)) {
                throw new Exception("Cart is empty");
            }

            $createdOrders = [];

            foreach ($cartItems as $item) {
                $totalPrice = $item['price'] * $item['quantity'];
                $id = $this->generateUUID();

                $sql = "INSERT INTO orders 
                        (id, user_id, product_id, quantity, total_price, payment_status, order_status) 
                    VALUES 
                        (:id, :user_id, :product_id, :quantity, :total_price, :payment_status, :order_status)";

                $stmt = $this->pdo->prepare($sql);
                $success = $stmt->execute([
                    ':id'             => $id,
                    ':user_id'        => $userId,
                    ':product_id'     => $item['product_id'],
                    ':quantity'       => $item['quantity'],
                    ':total_price'    => $totalPrice,
                    ':payment_status' => $paymentStatus,
                    ':order_status'   => $orderStatus,
                ]);

                if (!$success) {
                    throw new Exception("Failed to create order for product {$item['product_id']}");
                }

                $createdOrders[] = [
                    'order_id'   => $id,
                    'product_id' => $item['product_id'],
                    'quantity'   => $item['quantity'],
                    'price'      => $item['price'],
                    'total'      => $totalPrice
                ];
            }

            // Clear cart only after successful order creation
            $this->deleteCartItemsByUser($userId);

            // ✅ Fetch user info
            $sqlUser = "SELECT fullName, email FROM users WHERE id = :id LIMIT 1";
            $stmtUser = $this->pdo->prepare($sqlUser);
            $stmtUser->execute([':id' => $userId]);
            $user = $stmtUser->fetch(PDO::FETCH_ASSOC);

            //fatch product 

            if (!$user) {
                throw new Exception("User not found");
            }

            // ✅ Prepare email
            $to = $user['email'];
            $subject = "Order Confirmation - Thank you for your purchase";

            // Build table of ordered items
            // Build table of ordered items with S.No
            $tableRows = "";
            $sno = 1;
            foreach ($createdOrders as $order) {
                // Fetch product info
                $sqlProduct = "SELECT name, image FROM products WHERE id = :id LIMIT 1";
                $stmtProduct = $this->pdo->prepare($sqlProduct);
                $stmtProduct->execute([':id' => $order['product_id']]);
                $product = $stmtProduct->fetch(PDO::FETCH_ASSOC);

                $productName = $product['name'] ?? "Unknown Product";
                $productImage = $product['image'] ?? "";

                $tableRows .= "
        <tr>
            <td style='text-align: center;'>{$sno}</td>
            <td>
                " . ($productImage ? "<img src='{$productImage}' alt='{$productName}' width='50' style='vertical-align: middle; margin-right: 8px;' />" : "") . "
                {$productName}
            </td>
            <td style='text-align: center;'>{$order['quantity']}</td>
            <td style='text-align: right;'>{$order['price']}</td>
            <td style='text-align: right;'>{$order['total']}</td>
        </tr>
    ";
                $sno++;
            }

            $messageBody = "
            <div style='font-family: Arial, sans-serif; color: #333; line-height: 1.6;'>
                <h2 style='color: #2E86C1;'>Hello {$user['fullName']},</h2>
                <p>Thank you for shopping with us! Your order has been successfully placed. Here are the details:</p>

                <table border='0' cellpadding='10' cellspacing='0' style='border-collapse: collapse; width: 100%; max-width: 600px; margin-top: 20px;'>
                    <thead>
                        <tr style='background-color: #2E86C1; color: #fff;'>
                            <th style='text-align: center;'>S.No</th>
                            <th style='text-align: left;'>Product</th>
                            <th style='text-align: center;'>Quantity</th>
                            <th style='text-align: right;'>Price</th>
                            <th style='text-align: right;'>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        $tableRows
                    </tbody>
                </table>

                <p style='margin-top: 20px;'>We will notify you once your order is shipped. If you have any questions, feel free to reply to this email.</p>

                <p style='margin-top: 30px; font-weight: bold; color: #2E86C1;'>Thank you for choosing us!</p>
                <p style='font-size: 12px; color: #777;'>This is an automated email, please do not reply directly.</p>
            </div>
            ";
            // ✅ Send mail 
            sendMail($to, $subject, $messageBody);

            // ✅ Final response
            return [
                'success' => true,
                'orders'  => $createdOrders
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'error'   => $e->getMessage()
            ];
        }
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

    public function GetOrderItem()
    {
        try {
            global $pdo;
            $stmt = $pdo->prepare("SELECT * FROM orders");
            $stmt->execute();

            $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (empty($orders)) {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'No orders found']);
                return;
            }

            http_response_code(200);
            echo json_encode(['success' => true, 'data' => $orders]);
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








class PlanController
{
    private $pdo;
    public function __construct($db)
    {
        $this->pdo = $db;
    }


    public function createPlan()
    {
        header('Content-Type: application/json');
        session_start();

        global $pdo; // your PDO instance

        // Check if user is logged in
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Unauthorized']);
            return;
        }

        try {
            $userId = $_SESSION['user_id'];

            // Decode JSON input
            $input = json_decode(file_get_contents('php://input'), true);

            if (!isset($input['planItem'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Missing planItem in request']);
                return;
            }

            $planItem = $input['planItem'];

            // Validate required fields
            if (empty($planItem['name']) || empty($planItem['duration'])) {
                http_response_code(422);
                echo json_encode(['success' => false, 'message' => 'Missing required fields: name or duration']);
                return;
            }

            $planName = $planItem['name'];
            $duration = $planItem['duration'];
            $startDate = date('Y-m-d');

            // Calculate expire date based on duration
            $expireDate = match ($duration) {
                '1 Month' => date('Y-m-d', strtotime('+30 days')),
                '3 Months' => date('Y-m-d', strtotime('+90 days')),
                '6 Months' => date('Y-m-d', strtotime('+180 days')),
                '1 Year' => date('Y-m-d', strtotime('+365 days')),
                default => date('Y-m-d', strtotime('+30 days')),
            };

            // Generate UUID for id
            $id = substr(str_replace('-', '', \Ramsey\Uuid\Uuid::uuid4()->toString()), 0, 30);

            // Insert into DB
            $stmt = $pdo->prepare("
            INSERT INTO user_plans (id, user_id, plan_name, start_date, expire_date)
            VALUES (:id, :user_id, :plan_name, :start_date, :expire_date)
        ");

            $stmt->bindParam(':id', $id);
            $stmt->bindParam(':user_id', $userId);
            $stmt->bindParam(':plan_name', $planName);
            $stmt->bindParam(':start_date', $startDate);
            $stmt->bindParam(':expire_date', $expireDate);

            $stmt->execute();

            // Success response
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Plan created successfully',
                'data' => [
                    'id' => $id,
                    'user_id' => $userId,
                    'plan_name' => $planName,
                    'start_date' => $startDate,
                    'expire_date' => $expireDate
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
}
