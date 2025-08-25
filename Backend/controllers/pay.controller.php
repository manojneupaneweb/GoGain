<?php
class PaymentController
{

    public function initiateKhaltiPayment()
    {
        header('Content-Type: application/json');

        try {
            $data = json_decode(file_get_contents('php://input'), true);

            if (!$data || !isset($data['amount'], $data['productId'], $data['redirectLink'])) {
                echo json_encode(["status" => "error", "message" => "Invalid input"]);
                return;
            }

            $amount = intval($data['amount']);
            $productId = $data['productId'];
            $redirectLink = $data['redirectLink'];

            $payload = [
                "return_url" => "http://localhost:5173/$redirectLink",
                "website_url" => "http://localhost:5173",
                "amount" => $amount,
                "purchase_order_id" => uniqid(), // unique ID
                "purchase_order_name" => "Product $productId",
                "customer_info" => [
                    "name" => "Test User",
                    "email" => "test@khalti.com",
                    "phone" => "9800000001"
                ]
            ];

            $curl = curl_init();
            curl_setopt_array($curl, [
                CURLOPT_URL => "https://dev.khalti.com/api/v2/epayment/initiate/",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => json_encode($payload),
                CURLOPT_HTTPHEADER => [
                    'Authorization: Key live_secret_key_68791341fdd94846a146f0457ff7b455', // fix Key
                    'Content-Type: application/json',
                ],
            ]);

            $response = curl_exec($curl);
            $err = curl_error($curl);
            curl_close($curl);

            if ($err) {
                echo json_encode(["status" => "error", "message" => $err]);
            } else {
                echo $response;
            }
        } catch (\Throwable $th) {
            echo json_encode(["status" => "error", "message" => $th->getMessage()]);
        }
    }
    public function verifyPayment()
    {
        header('Content-Type: application/json');

        try {
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data || !isset($data['pidx'])) {
                echo json_encode(["status" => false, "message" => "Invalid input"]);
                return;
            }

            $pidx = $data['pidx'];

            $curl = curl_init();
            curl_setopt_array($curl, [
                CURLOPT_URL => "https://dev.khalti.com/api/v2/epayment/lookup/",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => json_encode(["pidx" => $pidx]),
                CURLOPT_HTTPHEADER => [
                    'Authorization: Key live_secret_key_68791341fdd94846a146f0457ff7b455',
                    'Content-Type: application/json',
                ],
            ]);

            $response = curl_exec($curl);
            $err = curl_error($curl);
            curl_close($curl);

            if ($err) {
                echo json_encode(["success" => false, "message" => $err]);
                return;
            }

            $result = json_decode($response, true);

            if (isset($result['status']) && $result['status'] === 'Completed') {
                echo json_encode([
                    "success" => true,
                    "message" => "Payment verified",
                    "data" => $result
                ]);
            } else {
                echo json_encode([
                    "success" => false,
                    "message" => "Payment not completed",
                    "data" => $result
                ]);
            }
        } catch (\Throwable $th) {
            echo json_encode(["success" => false, "message" => $th->getMessage()]);
        }
    }
}
