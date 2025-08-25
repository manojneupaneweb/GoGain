<?php
class PaymentController {

    // Initiate Khalti Payment
    public function initiateKhaltiPayment() {
        header('Content-Type: application/json'); // ensure JSON output

        try {
            $data = json_decode(file_get_contents('php://input'), true);

            // Validate input
            if (!$data || !isset($data['amount']) || !isset($data['productId']) || !isset($data['redirectLink'])) {
                echo json_encode([
                    "status" => "error",
                    "message" => "Invalid input: amount, productId, redirectLink required"
                ]);
                return;
            }

            $amount = intval($data['amount']); // amount in paisa
            $productId = $data['productId'];
            $redirectLink = $data['redirectLink'];

            // Validate minimum amount (>= 1000 paisa = Rs 10)
            if ($amount < 1000) {
                echo json_encode([
                    "status" => "error",
                    "message" => "Amount should be at least 1000 paisa"
                ]);
                return;
            }

            // Khalti API payload
            $payload = [
                "return_url" => "http://localhost:5173/$redirectLink",
                "website_url" => "http://localhost:5173/",
                "amount" => $amount,
                "purchase_order_id" => $productId,
                "purchase_order_name" => "Test Product",
                "customer_info" => [
                    "name" => "Test User",
                    "email" => "test@khalti.com",
                    "phone" => "9800000001"
                ]
            ];

            // cURL request to Khalti
            $curl = curl_init();
            curl_setopt_array($curl, [
                CURLOPT_URL => "https://dev.khalti.com/api/v2/epayment/initiate/",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_CUSTOMREQUEST => "POST",
                CURLOPT_POSTFIELDS => json_encode($payload),
                CURLOPT_HTTPHEADER => [
                    "Authorization: key live_secret_key_68791341fdd94846a146f0457ff7b455",
                    "Content-Type: application/json"
                ],
            ]);

            $response = curl_exec($curl);
            $err = curl_error($curl);
            curl_close($curl);

            if ($err) {
                echo json_encode(["status" => "error", "message" => $err]);
            } else {
                // Return Khalti response (includes payment_url)
                echo $response;
            }

        } catch (\Throwable $th) {
            echo json_encode(["status" => "error", "message" => $th->getMessage()]);
        }
    }

    // Optional: Lookup API to verify payment after callback
    public function verifyPayment($pidx) {
        header('Content-Type: application/json');

        if (!$pidx) {
            echo json_encode(["status" => "error", "message" => "pidx is required"]);
            return;
        }

        $payload = ["pidx" => $pidx];

        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => "https://dev.khalti.com/api/v2/epayment/lookup/",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => json_encode($payload),
            CURLOPT_HTTPHEADER => [
                "Authorization: key live_secret_key_68791341fdd94846a146f0457ff7b455",
                "Content-Type: application/json"
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
    }
}
