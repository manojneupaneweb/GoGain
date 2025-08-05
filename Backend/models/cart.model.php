<?php
class CartItem
{
    public $id;
    public $user_id;
    public $product_id;
    public $quantity;
    public $price;
    public $createdAt;
    public $updatedAt;

    public function __construct($data = [])
    {
        $this->id = $data['id'] ?? null;
        $this->user_id = $data['user_id'] ?? null;
        $this->product_id = $data['product_id'] ?? null;
        $this->quantity = $data['quantity'] ?? 1;
        $this->price = $data['price'] ?? 0.0;
        $this->createdAt = $data['createdAt'] ?? date('Y-m-d H:i:s');
        $this->updatedAt = $data['updatedAt'] ?? date('Y-m-d H:i:s');
    }
}

class Order
{
    public $id;
    public $user_id;
    public $product_id;
    public $quantity;
    public $payment_status;
    public $order_status;
    public $createdAt;
    public $updatedAt;
    public $address;

    public function __construct($data = [])
    {
        $this->id = $data['id'] ?? null;
        $this->user_id = $data['user_id'] ?? null;
        $this->product_id = $data['product_id'] ?? null;
        $this->quantity = $data['quantity'] ?? 1;
        $this->payment_status = $data['payment_status'] ?? 'pending';
        $this->order_status = $data['order_status'] ?? 'processing';
        $this->createdAt = $data['createdAt'] ?? date('Y-m-d H:i:s');
        $this->updatedAt = $data['updatedAt'] ?? date('Y-m-d H:i:s');
        $this->address = $data['address'] ?? '';
    }
}

class UserPlan
{
    public $id;
    public $user_id;
    public $plan_name;
    public $start_date;
    public $expire_date;
    public $created_at;
}


?>