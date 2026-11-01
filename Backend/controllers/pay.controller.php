<?php
require_once __DIR__ . '/../utils/plans.php';
require_once __DIR__ . '/cart.controller.php';
require_once __DIR__ . '/../middleware/email.middleware.php';

use Ramsey\Uuid\Uuid;

class PaymentController
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
        $this->pdo->exec("
            CREATE TABLE IF NOT EXISTS payments (
                id CHAR(36) PRIMARY KEY,
                user_id CHAR(36) NOT NULL,
                provider VARCHAR(20) NOT NULL,
                purpose VARCHAR(20) NOT NULL,
                reference VARCHAR(80) NULL,
                amount_paisa INT NOT NULL,
                plan_key VARCHAR(32) NULL,
                status VARCHAR(20) NOT NULL,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY uniq_provider_reference (provider, reference)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        ");
    }

    public function initiateKhaltiPayment()
    {
        header('Content-Type: application/json');
        $started = $this->startPayment('khalti');
        if (!$started) {
            return;
        }

        $payload = [
            'return_url' => $started['return_url'],
            'website_url' => $started['origin'],
            'amount' => $started['amount_paisa'],
            'purchase_order_id' => $started['id'],
            'purchase_order_name' => $started['name'],
            'customer_info' => $started['customer'],
        ];

        $result = $this->khaltiRequest('/epayment/initiate/', $payload);
        if (!$result || empty($result['pidx']) || empty($result['payment_url'])) {
            $this->failPayment($started['id']);
            http_response_code(502);
            echo json_encode(['success' => false, 'message' => 'Payment provider error']);
            return;
        }

        $stmt = $this->pdo->prepare("UPDATE payments SET reference = ? WHERE id = ?");
        $stmt->execute([$result['pidx'], $started['id']]);

        echo json_encode([
            'success' => true,
            'message' => 'Payment started',
            'data' => ['payment_url' => $result['payment_url']],
        ]);
    }

    public function verifyPayment()
    {
        header('Content-Type: application/json');
        $data = json_decode(file_get_contents('php://input'), true);
        $pidx = trim((string) ($data['pidx'] ?? ''));
        if ($pidx === '') {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid input']);
            return;
        }

        $result = $this->khaltiRequest('/epayment/lookup/', ['pidx' => $pidx]);
        if (!$result || ($result['status'] ?? '') !== 'Completed') {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Payment not completed']);
            return;
        }

        $payment = $this->findPayment('khalti', $pidx);
        if (!$payment || (int) $result['total_amount'] !== (int) $payment['amount_paisa']) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Payment amount does not match']);
            return;
        }
        if (($result['purchase_order_id'] ?? '') !== $payment['id']) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Payment does not match this order']);
            return;
        }

        $this->fulfill($payment);
    }

    public function initiateEsewaPayment()
    {
        header('Content-Type: application/json');
        $started = $this->startPayment('esewa');
        if (!$started) {
            return;
        }

        $total = number_format($started['amount_paisa'] / 100, 2, '.', '');
        $uuid = Uuid::uuid4()->toString();
        $productCode = $_ENV['ESEWA_PRODUCT_CODE'] ?? '';
        $secret = $_ENV['ESEWA_SECRET_KEY'] ?? '';
        if ($productCode === '' || $secret === '') {
            $this->failPayment($started['id']);
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Payment is not configured']);
            return;
        }

        $message = "total_amount={$total},transaction_uuid={$uuid},product_code={$productCode}";
        $signature = base64_encode(hash_hmac('sha256', $message, $secret, true));

        $stmt = $this->pdo->prepare("UPDATE payments SET reference = ? WHERE id = ?");
        $stmt->execute([$uuid, $started['id']]);

        $return = $started['return_url'] . '?provider=esewa';
        echo json_encode([
            'success' => true,
            'message' => 'Payment started',
            'data' => [
                'action' => $_ENV['ESEWA_FORM_URL'],
                'fields' => [
                    'amount' => $total,
                    'tax_amount' => '0',
                    'total_amount' => $total,
                    'transaction_uuid' => $uuid,
                    'product_code' => $productCode,
                    'product_service_charge' => '0',
                    'product_delivery_charge' => '0',
                    'success_url' => $return,
                    'failure_url' => $started['origin'] . '/cart',
                    'signed_field_names' => 'total_amount,transaction_uuid,product_code',
                    'signature' => $signature,
                ],
            ],
        ]);
    }

    public function verifyEsewaPayment()
    {
        header('Content-Type: application/json');
        $data = json_decode(file_get_contents('php://input'), true);
        $encoded = $data['data'] ?? '';
        $decoded = json_decode(base64_decode((string) $encoded), true);
        if (!is_array($decoded)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid input']);
            return;
        }

        $uuid = $decoded['transaction_uuid'] ?? '';
        $total = $decoded['total_amount'] ?? '';
        $productCode = $decoded['product_code'] ?? '';
        $payment = $this->findPayment('esewa', $uuid);
        if (!$payment) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Payment not found']);
            return;
        }

        $query = http_build_query([
            'product_code' => $productCode,
            'total_amount' => $total,
            'transaction_uuid' => $uuid,
        ]);
        $statusUrl = rtrim($_ENV['ESEWA_VERIFY_URL'] ?? '', '?&');
        $curl = curl_init($statusUrl . (str_contains($statusUrl, '?') ? '&' : '?') . $query);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        $raw = curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl);
        if ($err) {
            error_log($err);
        }
        $status = json_decode($raw ?: '', true);
        $paidPaisa = (int) round(((float) $total) * 100);
        if (!$status || ($status['status'] ?? '') !== 'COMPLETE' || $paidPaisa !== (int) $payment['amount_paisa']) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Payment not completed']);
            return;
        }

        $this->fulfill($payment);
    }

    private function startPayment($provider)
    {
        $data = json_decode(file_get_contents('php://input'), true) ?: [];
        $purpose = ($data['purpose'] ?? '') === 'plan' ? 'plan' : 'order';
        $userId = authUserId();
        if (!$userId) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Unauthorized']);
            return null;
        }

        $stmt = $this->pdo->prepare("SELECT fullName, email, phone FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$user) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Unauthorized']);
            return null;
        }

        $planKey = null;
        if ($purpose === 'plan') {
            $planKey = $data['planKey'] ?? '';
            $plan = findPlan($planKey);
            if (!$plan) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Unknown plan']);
                return null;
            }
            $rupees = $plan['price'];
            $name = $plan['name'];
            $path = '/createplan';
        } else {
            $orders = new OrderController($this->pdo);
            $rupees = $orders->quoteCart($userId);
            if ($rupees === null) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Cart is empty']);
                return null;
            }
            $name = 'GoGain cart';
            $path = '/paymentsuccess';
        }

        $origin = rtrim($_ENV['APP_ORIGIN'] ?? '', '/');
        $allowed = ['/paymentsuccess', '/createplan'];
        if ($origin === '' || !in_array($path, $allowed, true)) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Payment is not configured']);
            return null;
        }

        $amountPaisa = (int) round($rupees * 100);
        if ($provider === 'khalti' && $amountPaisa < 1000) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Amount is below the payment minimum']);
            return null;
        }

        $id = Uuid::uuid4()->toString();
        $insert = $this->pdo->prepare("
            INSERT INTO payments (id, user_id, provider, purpose, amount_paisa, plan_key, status)
            VALUES (?, ?, ?, ?, ?, ?, 'pending')
        ");
        $insert->execute([$id, $userId, $provider, $purpose, $amountPaisa, $planKey]);

        return [
            'id' => $id,
            'amount_paisa' => $amountPaisa,
            'name' => $name,
            'origin' => $origin,
            'return_url' => $origin . $path,
            'customer' => [
                'name' => $user['fullName'],
                'email' => $user['email'],
                'phone' => $user['phone'] ?: '9800000000',
            ],
        ];
    }

    private function findPayment($provider, $reference)
    {
        $userId = authUserId();
        $stmt = $this->pdo->prepare("
            SELECT id, user_id, provider, purpose, reference, amount_paisa, plan_key, status
            FROM payments
            WHERE provider = ? AND reference = ? AND user_id = ?
            LIMIT 1
        ");
        $stmt->execute([$provider, $reference, $userId]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    private function fulfill(array $payment)
    {
        if ($payment['status'] === 'paid') {
            echo json_encode([
                'success' => true,
                'message' => 'Payment already recorded',
                'data' => ['reference' => $payment['reference'], 'purpose' => $payment['purpose']],
            ]);
            return;
        }

        try {
            $this->pdo->beginTransaction();
            $locked = $this->pdo->prepare("SELECT id, status, purpose, plan_key, user_id, reference FROM payments WHERE id = ? FOR UPDATE");
            $locked->execute([$payment['id']]);
            $row = $locked->fetch(PDO::FETCH_ASSOC);
            if (!$row) {
                throw new Exception('Payment not found');
            }
            if ($row['status'] === 'paid') {
                $this->pdo->commit();
                echo json_encode([
                    'success' => true,
                    'message' => 'Payment already recorded',
                    'data' => ['reference' => $row['reference'], 'purpose' => $row['purpose']],
                ]);
                return;
            }

            $placed = null;
            if ($row['purpose'] === 'plan') {
                $plan = findPlan($row['plan_key']);
                if (!$plan) {
                    throw new Exception('Unknown plan');
                }
                $plans = new PlanController($this->pdo);
                $placed = $plans->placePaidPlan($row['user_id'], $plan);
            } else {
                $orders = new OrderController($this->pdo);
                $placed = $orders->placePaidOrder($row['user_id']);
            }

            $this->pdo->prepare("UPDATE payments SET status = 'paid' WHERE id = ?")->execute([$row['id']]);
            $this->pdo->commit();
        } catch (Exception $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }
            error_log($e->getMessage());
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Could not record payment']);
            return;
        }

        if ($payment['purpose'] === 'order' && !empty($placed['user']['email'])) {
            $this->sendOrderMail($placed);
        }

        echo json_encode([
            'success' => true,
            'message' => 'Payment verified',
            'data' => [
                'reference' => $payment['reference'],
                'purpose' => $payment['purpose'],
            ],
        ]);
    }

    private function sendOrderMail(array $placed)
    {
        $rows = '';
        $n = 1;
        foreach ($placed['orders'] as $order) {
            $name = htmlspecialchars($order['product_name'], ENT_QUOTES, 'UTF-8');
            $rows .= '<tr><td>' . $n . '</td><td>' . $name . '</td><td>' . (int) $order['quantity'] . '</td><td>' . htmlspecialchars((string) $order['total'], ENT_QUOTES, 'UTF-8') . '</td></tr>';
            $n++;
        }
        $who = htmlspecialchars($placed['user']['fullName'], ENT_QUOTES, 'UTF-8');
        $address = htmlspecialchars($placed['address'], ENT_QUOTES, 'UTF-8');
        sendMail(
            $placed['user']['email'],
            'Order confirmation',
            '<p>Hello ' . $who . ',</p><p>Your order is paid. Delivery: ' . $address . '</p><table>' . $rows . '</table>'
        );
    }

    private function khaltiRequest($path, array $body)
    {
        $key = $_ENV['KHALTI_SECRET_KEY'] ?? '';
        $base = rtrim($_ENV['KHALTI_BASE_URL'] ?? '', '/');
        if ($key === '' || $base === '') {
            return null;
        }

        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => $base . $path,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($body),
            CURLOPT_HTTPHEADER => [
                'Authorization: Key ' . $key,
                'Content-Type: application/json',
            ],
        ]);
        $response = curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl);
        if ($err) {
            error_log($err);
            return null;
        }
        return json_decode($response, true);
    }

    private function failPayment($id)
    {
        $this->pdo->prepare("UPDATE payments SET status = 'failed' WHERE id = ?")->execute([$id]);
    }
}
