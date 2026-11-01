<?php
require_once __DIR__ . '/../config/db.php';

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
