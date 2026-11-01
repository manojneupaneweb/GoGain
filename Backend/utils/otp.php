<?php

function ensureOtpTable(PDO $pdo)
{
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
        SET used_at = NOW()
        WHERE email = ? AND purpose = ? AND used_at IS NULL
    ")->execute([$email, $purpose]);

    $code = (string) random_int(100000, 999999);
    $hash = password_hash($code, PASSWORD_DEFAULT);
    $pdo->prepare("
        INSERT INTO email_otps (email, purpose, code_hash, expires_at)
        VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 5 MINUTE))
    ")->execute([$email, $purpose, $hash]);

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
        $pdo->prepare("UPDATE email_otps SET used_at = NOW() WHERE id = ?")->execute([$row['id']]);
        return null;
    }

    if (!password_verify($code, $row['code_hash'])) {
        $pdo->prepare("UPDATE email_otps SET attempts = attempts + 1 WHERE id = ?")->execute([$row['id']]);
        return null;
    }

    $pdo->prepare("UPDATE email_otps SET used_at = NOW() WHERE id = ?")->execute([$row['id']]);

    $token = bin2hex(random_bytes(32));
    $proofPurpose = $purpose . '_proof';
    $pdo->prepare("
        UPDATE email_otps SET used_at = NOW()
        WHERE email = ? AND purpose = ? AND used_at IS NULL
    ")->execute([$email, $proofPurpose]);
    $pdo->prepare("
        INSERT INTO email_otps (email, purpose, code_hash, expires_at)
        VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 15 MINUTE))
    ")->execute([$email, $proofPurpose, password_hash($token, PASSWORD_DEFAULT)]);

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

    $pdo->prepare("UPDATE email_otps SET used_at = NOW() WHERE id = ?")->execute([$row['id']]);
    return true;
}
