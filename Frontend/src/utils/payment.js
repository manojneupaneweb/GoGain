import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
import axios from 'axios';



export const initiateEsewaPayment = (amount, productId, redirectlink) => {
  const transaction_uuid = uuidv4();
  const formData = {
    amount: amount.toString(),
    tax_amount: "0",
    total_amount: amount.toString(),
    transaction_uuid,
    product_service_charge: "0",
    product_delivery_charge: "0",
    product_code: "EPAYTEST",
    success_url: redirectlink ? `${window.location.origin}${redirectlink}` : `${window.location.origin}/paymentsuccess`,
    failure_url: `${window.location.origin}/paymentfailure`,
    signed_field_names: "total_amount,transaction_uuid,product_code",
    secret: "8gBm/:&EnhH.1/q",
  };

  const dataString =
    `total_amount=${formData.total_amount},` +
    `transaction_uuid=${formData.transaction_uuid},` +
    `product_code=${formData.product_code}`;

  const hmac = CryptoJS.HmacSHA256(
    CryptoJS.enc.Utf8.parse(dataString),
    CryptoJS.enc.Utf8.parse(formData.secret)
  );

  const signature = CryptoJS.enc.Base64.stringify(hmac);

  formData.signature = signature;
  delete formData.secret;

  const form = document.createElement("form");
  form.method = "POST";
  form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

  Object.entries(formData).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};






export const initiateKhaltiPayment = async (amount, productId) => {
  try {
    const response = await axios.post('/api/v1/payment/khalti/initiate', {
      amount: 1000,  // example amount in paisa
      purchase_order_id: 'order-123',
      purchase_order_name: 'Test Product',
      return_url: `${window.location.origin}/khalti/return`,
      website_url: window.location.origin,
      customer_info: {
        name: 'Ram Bahadur',
        email: 'test@khalti.com',
        phone: '9800000001'
      }
    });
    console.log('Khalti response:', response.data);

    if (response.data.payment_url) {
      window.location.href = response.data.payment_url;
    } else if (response.data.error) {
      console.error('Khalti API error:', response.data.error);
    }
  } catch (err) {
    console.error('Request failed', err);
  }
};







