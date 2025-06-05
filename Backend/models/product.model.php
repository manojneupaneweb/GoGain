<?php
declare(strict_types=1);

class ProductModel {
    public $id;
    public $name;
    public $description;
    public $price;
    public $category;
    public $image;
    public $stock;
    public $rating;
    public $reviews;
    public $discount;
    public $specifications;
    public $warranty;
    public $created_at;
    public $updated_at;

    public function __construct(array $data = []) {
        foreach ($data as $key => $value) {
            if (property_exists($this, $key)) {
                $this->$key = $value;
            }
        }
    }
}
?>