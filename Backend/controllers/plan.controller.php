<?php
require_once __DIR__ . '/../config/db.php';

use Ramsey\Uuid\Uuid;

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
        $id = \Ramsey\Uuid\Uuid::uuid4()->toString();
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
