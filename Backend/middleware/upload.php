<?php
if (isset($_POST['submit'])) {
    $targetDir = "uploads/";
    $fileName = basename($_FILES["image"]["name"]);
    $targetFile = $targetDir . time() . "_" . $fileName;

    $fileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));
    $allowedTypes = ['jpg', 'jpeg', 'png', 'webp'];

    if (in_array($fileType, $allowedTypes)) {
        if (move_uploaded_file($_FILES["image"]["tmp_name"], $targetFile)) {
            echo "Image uploaded: <a href='$targetFile'>$fileName</a>";
        } else {
            echo "❌ Error uploading file.";
        }
    } else {
        echo "❌ Only JPG, JPEG, PNG, and WEBP allowed.";
    }
}
?>
