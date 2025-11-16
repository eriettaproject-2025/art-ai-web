<?php
// saveData.php

// --- 1. Στοιχεία σύνδεσης στη βάση ---
$servername = "localhost";  // XAMPP τοπικός server
$username = "root";         // default user στο XAMPP
$password = "";             // default κενό password
$dbname = "artDB";

// --- 2. Σύνδεση στη βάση ---
$conn = new mysqli($servername, $username, $password, $dbname);

// Έλεγχος σύνδεσης
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// --- 3. Λήψη δεδομένων από JS ---
$data = file_get_contents("php://input");

// --- 4. Προετοιμασία και αποθήκευση στην βάση ---
$stmt = $conn->prepare("INSERT INTO user_data (data) VALUES (?)");
$stmt->bind_param("s", $data); // "s" = string

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
