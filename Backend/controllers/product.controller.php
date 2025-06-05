<?php
require_once __DIR__ . '/../models/product.model.php';
require_once __DIR__ . '/../middleware/email.middleware.php';
require_once __DIR__ . '/../utils/Cloudinary.php';

require 'vendor/autoload.php';
use Ramsey\Uuid\Uuid;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;


class ProductController
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    private function uploadImage($tmpPath)
    {
        // Dummy URL - replace with your actual image uploader
        $target = 'uploads/' . uniqid() . '.jpg';
        move_uploaded_file($tmpPath, $target);
        return $target;
    }

    public function createProduct()
    {
        header('Content-Type: application/json');

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Only POST requests are allowed.']);
            exit;
        }

        try {
            // Fetching form fields
            $name = trim($_POST['name'] ?? '');
            $description = trim($_POST['description'] ?? '');
            $price = trim($_POST['price'] ?? '');
            $category = trim($_POST['category'] ?? '');
            $stock = trim($_POST['stock'] ?? '');
            $discount = trim($_POST['discountPercentage'] ?? '');
            $warranty = trim($_POST['warranty'] ?? '');
            $specifications = json_decode($_POST['specifications'], true);

            $imageFile = $_FILES['image'] ?? null;

            // Validate required fields
            $errors = [];

            if (empty($name))
                $errors[] = 'name';
            if (empty($description))
                $errors[] = 'description';
            if (!is_numeric($price) || $price <= 0)
                $errors[] = 'price';
            if (empty($category))
                $errors[] = 'category';
            if (empty($stock) || !is_numeric($stock))
                $errors[] = 'stock';
            if ($discount !== '' && (!is_numeric($discount) || $discount < 0 || $discount > 100))
                $errors[] = 'discountPercentage';
            if (empty($warranty))
                $errors[] = 'warranty';
            if (empty($imageFile) || empty($imageFile['tmp_name']))
                $errors[] = 'image';

            if (!is_array($specifications) || count($specifications) === 0) {
                $errors[] = 'specifications';
            } else {
                foreach ($specifications as $index => $spec) {
                    if (empty($spec['topic']) || empty($spec['value'])) {
                        $errors[] = "specifications[$index] is incomplete";
                    }
                }
            }

            // If validation fails
            if (!empty($errors)) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Missing or invalid fields.', 'errors' => $errors]);
                exit;
            }
            // Upload image (replace this with your own function)
            $imageUrl = uploadOnCloudinary($imageFile['tmp_name']);

            // Convert specs to JSON
            $specsJSON = json_encode($specifications);
            $id = substr(str_replace('-', '', Uuid::uuid4()->toString()), 0, 30);

            // Insert into DB
            $stmt = $this->pdo->prepare("
               INSERT INTO products 
                (id, name, description, price, category, image, stock, rating, reviews, discount, specifications, warranty, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
            ");


            $stmt->execute([
                $id,
                $name,
                $description,
                $price,
                $category,
                $imageUrl,
                $stock,
                0,
                0,
                $discount,
                $specsJSON,
                $warranty
            ]);



            echo json_encode([
                'success' => true,
                'message' => 'Product created successfully',
                'data' => [
                    'name' => $name,
                    'image' => $imageUrl,
                ]
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Server error', 'error' => $e->getMessage()]);
        }
    }
    public function getAllProduct()
    {
        header('Content-Type: application/json');

        try {
            $stmt = $this->pdo->query("SELECT * FROM products");
            $products = $stmt->fetchAll(PDO::FETCH_CLASS, 'ProductModel');

            if (empty($products)) {
                echo json_encode(['success' => true, 'message' => 'No products found']);
                return;
            }

            echo json_encode(['success' => true, 'data' => $products]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Server error', 'error' => $e->getMessage()]);
        }
    }

}
