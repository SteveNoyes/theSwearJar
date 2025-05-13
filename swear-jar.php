<?php
// db.php
$host = '';
$db   = '';
$user = '';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed.']);
    exit;
}

// handle POST requests to add a dollar
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['user_id']) || !is_numeric($data['user_id'])) {
        echo json_encode(['error' => 'Missing user ID']);
        exit;
    }

    $reason = isset($data['reason']) ? $data['reason'] : 'No reason';
    $userId = (int) $data['user_id'];

    $stmt = $pdo->prepare("INSERT INTO swear_entries (user_id, amount, reason) VALUES (?, 1, ?)");
    $stmt->execute([$userId, $reason]);

    echo json_encode(['success' => true]);
    exit;
}

// handle GET request to fetch data
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query("SELECT users.id, users.name, COALESCE(SUM(amount), 0) AS total FROM users LEFT JOIN swear_entries ON users.id = swear_entries.user_id GROUP BY users.id ORDER BY total DESC");
    $users = $stmt->fetchAll();

    foreach ($users as &$user) {
        $historyStmt = $pdo->prepare("SELECT amount, reason, timestamp FROM swear_entries WHERE user_id = ? ORDER BY timestamp DESC LIMIT 5");
        $historyStmt->execute([$user['id']]);
        $user['history'] = $historyStmt->fetchAll();
    }

    echo json_encode($users);
    exit;
}
?>
