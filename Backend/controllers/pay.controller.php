<?php

class PayController {
   public function initiateKhaltiPayment($data) {
      $payload = [
         "return_url" => $data['return_url'] ?? '',
         "website_url" => $data['website_url'] ?? '',
         "amount" => $data['amount'] ?? 0,
         "purchase_order_id" => $data['purchase_order_id'] ?? '',
         "purchase_order_name" => $data['purchase_order_name'] ?? '',
         "customer_info" => $data['customer_info'] ?? []
      ];

      $ch = curl_init('https://dev.khalti.com/api/v2/epayment/initiate/');
      curl_setopt($ch, CURLOPT_HTTPHEADER, [
         'Authorization: Key a552042a0421456090d846ce4bc23e7e',
         'Content-Type: application/json'
      ]);
      curl_setopt($ch, CURLOPT_POST, true);
      curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

      $response = curl_exec($ch);
      $error = curl_error($ch);
      $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
      curl_close($ch);

      header('Content-Type: application/json');
      http_response_code($status);

      if ($error) {
         echo json_encode(['error' => $error]);
         exit;
      }

      if (!$response) {
         echo json_encode(['error' => 'Empty response from Khalti']);
         exit;
      }

      echo $response;
      exit;
   }
}
