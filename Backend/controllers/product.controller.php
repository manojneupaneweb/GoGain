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
    public function getProductByID($id)
    {
        header('Content-Type: application/json');

        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Only GET requests are allowed.']);
            exit;
        }

        if (empty($id)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Product ID is required.']);
            return;
        }

        try {
            $stmt = $this->pdo->prepare("SELECT * FROM products WHERE id = ?");
            $stmt->execute([$id]);
            $product = $stmt->fetchObject('ProductModel');

            if (!$product) {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Product not found.']);
                return;
            }

            echo json_encode(['success' => true, 'data' => $product]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Server error', 'error' => $e->getMessage()]);
        }
    }

    public function deleteProduct($id)
    {
        global $pdo;

        try {
            $stmt = $pdo->prepare("DELETE FROM products WHERE id = :id");
            $stmt->execute(['id' => $id]);

            if ($stmt->rowCount()) {
                echo json_encode([
                    "success" => true,
                    "message" => "Product deleted successfully"
                ]);
            } else {
                echo json_encode([
                    "success" => false,
                    "message" => "Product not found"
                ]);
            }
        } catch (PDOException $e) {
            echo json_encode([
                "success" => false,
                "message" => "Database error",
                "error" => $e->getMessage()
            ]);
        }
    }

    public function updateProduct($productId)
{
    global $pdo;

    parse_str(file_get_contents("php://input"), $_PUT);

    $name = $_POST['name'] ?? null;
    $description = $_POST['description'] ?? null;
    $price = $_POST['price'] ?? null;
    $stock = $_POST['stock'] ?? null;
    $category = $_POST['category'] ?? null;

    if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
        $imageName = uniqid() . "_" . $_FILES['image']['name'];
        move_uploaded_file($_FILES['image']['tmp_name'], "../uploads/" . $imageName);
        $imagePath = "/uploads/" . $imageName;
    } else {
        // Optional: handle missing image or retain existing
        $stmt = $pdo->prepare("SELECT image FROM products WHERE id = ?");
        $stmt->execute([$productId]);
        $imagePath = $stmt->fetchColumn();
    }

    $stmt = $pdo->prepare("UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category = ?, image = ? WHERE id = ?");
    $success = $stmt->execute([$name, $description, $price, $stock, $category, $imagePath, $productId]);

    if ($success) {
        echo json_encode(['success' => true, 'message' => 'Product updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update product']);
    }
}








}




