import api from './api';
import { toast } from "react-toastify";

function submitForm(action, fields) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = action;

  Object.entries(fields).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}

export const initiateEsewaPayment = async (purpose, planKey) => {
  try {
    const response = await api.post("/api/v1/payment/esewa/initiate", { purpose, planKey });
    const payload = response.data?.data;
    if (!payload?.action || !payload?.fields) {
      toast.error("Payment initiation failed. Try again.");
      return;
    }
    submitForm(payload.action, payload.fields);
  } catch (error) {
    toast.error(error.response?.data?.message || "Payment error. Try again.");
  }
};

export const initiateKhaltiPayment = async (purpose, planKey) => {
  try {
    const response = await api.post("/api/v1/payment/khalti/initiate", {
      purpose,
      planKey,
    });

    const url = response.data?.data?.payment_url;
    if (url) {
      window.location.href = url;
      return;
    }
    toast.error("Payment initiation failed. Try again.");
  } catch (error) {
    toast.error(error.response?.data?.message || "Payment error. Try again.");
  }
};
