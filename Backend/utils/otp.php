<?php

function ensureOtpTable(PDO $pdo)
{
    if ($pdo->getAttribute(PDO::ATTR_DRIVER_NAME) === 'sqlite') {
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS email_otps (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL,
                purpose TEXT NOT NULL,
                code_hash TEXT NOT NULL,
                attempts INTEGER NOT NULL DEFAULT 0,
                expires_at TEXT NOT NULL,
                used_at TEXT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        ");
        return;
    }

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS email_otps (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            purpose VARCHAR(32) NOT NULL,
            code_hash VARCHAR(255) NOT NULL,
            attempts INT NOT NULL DEFAULT 0,
            expires_at DATETIME NOT NULL,
            used_at DATETIME NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_email_purpose (email, purpose)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");
}

function issueOtp(PDO $pdo, $email, $purpose)
{
    ensureOtpTable($pdo);

    $pdo->prepare("
        UPDATE email_otps
        SET used_at = ?
        WHERE email = ? AND purpose = ? AND used_at IS NULL
    ")->execute([date('Y-m-d H:i:s'), $email, $purpose]);

    $code = (string) random_int(100000, 999999);
    $hash = password_hash($code, PASSWORD_DEFAULT);
    $expires = date('Y-m-d H:i:s', time() + 300);
    $pdo->prepare("
        INSERT INTO email_otps (email, purpose, code_hash, expires_at)
        VALUES (?, ?, ?, ?)
    ")->execute([$email, $purpose, $hash, $expires]);

    return $code;
}

function verifyOtpCode(PDO $pdo, $email, $purpose, $code)
{
    ensureOtpTable($pdo);
    $code = trim((string) $code);

    $stmt = $pdo->prepare("
        SELECT id, code_hash, attempts, expires_at
        FROM email_otps
        WHERE email = ? AND purpose = ? AND used_at IS NULL
        ORDER BY id DESC
        LIMIT 1
    ");
    $stmt->execute([$email, $purpose]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        return null;
    }

    if (strtotime($row['expires_at']) < time() || (int) $row['attempts'] >= 5) {
        $pdo->prepare("UPDATE email_otps SET used_at = ? WHERE id = ?")->execute([date('Y-m-d H:i:s'), $row['id']]);
        return null;
    }

    if (!password_verify($code, $row['code_hash'])) {
        $pdo->prepare("UPDATE email_otps SET attempts = attempts + 1 WHERE id = ?")->execute([$row['id']]);
        return null;
    }

    $pdo->prepare("UPDATE email_otps SET used_at = ? WHERE id = ?")->execute([date('Y-m-d H:i:s'), $row['id']]);

    $token = bin2hex(random_bytes(32));
    $proofPurpose = $purpose . '_proof';
    $pdo->prepare("
        UPDATE email_otps SET used_at = ?
        WHERE email = ? AND purpose = ? AND used_at IS NULL
    ")->execute([date('Y-m-d H:i:s'), $email, $proofPurpose]);
    $proofExpires = date('Y-m-d H:i:s', time() + 900);
    $pdo->prepare("
        INSERT INTO email_otps (email, purpose, code_hash, expires_at)
        VALUES (?, ?, ?, ?)
    ")->execute([$email, $proofPurpose, password_hash($token, PASSWORD_DEFAULT), $proofExpires]);

    return $token;
}

function consumeProof(PDO $pdo, $email, $purpose, $token)
{
    ensureOtpTable($pdo);
    $token = trim((string) $token);
    if ($token === '') {
        return false;
    }

    $proofPurpose = $purpose . '_proof';
    $stmt = $pdo->prepare("
        SELECT id, code_hash, expires_at
        FROM email_otps
        WHERE email = ? AND purpose = ? AND used_at IS NULL
        ORDER BY id DESC
        LIMIT 1
    ");
    $stmt->execute([$email, $proofPurpose]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row || strtotime($row['expires_at']) < time()) {
        return false;
    }

    if (!password_verify($token, $row['code_hash'])) {
        return false;
    }

    $pdo->prepare("UPDATE email_otps SET used_at = ? WHERE id = ?")->execute([date('Y-m-d H:i:s'), $row['id']]);
    return true;
}
