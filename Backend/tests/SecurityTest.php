<?php

use PHPUnit\Framework\TestCase;

class SecurityTest extends TestCase
{
    public function testOtpIsSingleUseAndRejectsTheMasterCode()
    {
        $pdo = testPdo();
        $code = issueOtp($pdo, 'member@gogain.test', 'reset');

        $this->assertNotSame('625612', $code);
        $this->assertNull(verifyOtpCode($pdo, 'member@gogain.test', 'reset', '625612'));

        $proof = verifyOtpCode($pdo, 'member@gogain.test', 'reset', $code);
        $this->assertNotEmpty($proof);
        $this->assertNull(verifyOtpCode($pdo, 'member@gogain.test', 'reset', $code));
        $this->assertTrue(consumeProof($pdo, 'member@gogain.test', 'reset', $proof));
        $this->assertFalse(consumeProof($pdo, 'member@gogain.test', 'reset', $proof));
    }

    public function testResetResponseDoesNotRevealAMissingAccount()
    {
        $pdo = testPdo();
        $pdo->exec("CREATE TABLE users (id TEXT PRIMARY KEY, email TEXT, password TEXT)");
        $proof = verifyOtpCode($pdo, 'missing@gogain.test', 'reset', issueOtp($pdo, 'missing@gogain.test', 'reset'));

        $_SERVER['REMOTE_ADDR'] = '10.1.1.' . random_int(1, 200);
        $GLOBALS['test_json_body'] = [
            'email' => 'missing@gogain.test',
            'newPassword' => 'new-password',
            'reset_token' => $proof,
        ];

        $controller = new UserController($pdo);
        ob_start();
        $controller->forgetPassword();
        $body = json_decode(ob_get_clean(), true);

        $this->assertTrue($body['success']);
        $this->assertSame(
            'If an account exists for that email, the password has been reset.',
            $body['message']
        );
        unset($GLOBALS['test_json_body']);
    }

    public function testResetRejectsAProofIssuedForAnotherEmail()
    {
        $pdo = testPdo();
        $pdo->exec("CREATE TABLE users (id TEXT PRIMARY KEY, email TEXT, password TEXT)");
        $pdo->exec("INSERT INTO users (id, email, password) VALUES ('u1', 'member@gogain.test', 'hash')");
        $proof = verifyOtpCode($pdo, 'other@gogain.test', 'reset', issueOtp($pdo, 'other@gogain.test', 'reset'));

        $_SERVER['REMOTE_ADDR'] = '10.2.2.' . random_int(1, 200);
        $GLOBALS['test_json_body'] = [
            'email' => 'member@gogain.test',
            'newPassword' => 'new-password',
            'reset_token' => $proof,
        ];

        $controller = new UserController($pdo);
        ob_start();
        $controller->forgetPassword();
        $body = json_decode(ob_get_clean(), true);

        $this->assertFalse($body['success']);
        $this->assertSame('hash', $pdo->query("SELECT password FROM users WHERE id = 'u1'")->fetchColumn());
        unset($GLOBALS['test_json_body']);
    }

    public function testRolesComeFromTheUserRecord()
    {
        $this->assertTrue(userHasRole(['role' => 'admin'], 'admin'));
        $this->assertFalse(userHasRole(['role' => 'user'], 'admin'));
        $this->assertFalse(userHasRole(['role' => 'admin'], 'trainer'));
        $this->assertTrue(userHasRole(['role' => 'trainer'], 'trainer'));
    }

    public function testCartQuoteUsesTheCatalogPriceForThatUser()
    {
        $pdo = testPdo();
        $pdo->exec("CREATE TABLE products (id TEXT PRIMARY KEY, price REAL, stock INTEGER, name TEXT, image TEXT)");
        $pdo->exec("CREATE TABLE cart (id TEXT, user_id TEXT, product_id TEXT, quantity INTEGER, price REAL)");
        $pdo->exec("INSERT INTO products (id, price, stock, name, image) VALUES ('p1', 2500, 5, 'Whey', '')");
        $pdo->exec("INSERT INTO cart (id, user_id, product_id, quantity, price) VALUES ('c1', 'member', 'p1', 2, 1)");
        $pdo->exec("INSERT INTO cart (id, user_id, product_id, quantity, price) VALUES ('c2', 'other', 'p1', 1, 1)");

        $orders = new OrderController($pdo);
        $this->assertEquals(5000, $orders->quoteCart('member'));
        $this->assertEquals(2500, $orders->quoteCart('other'));
    }

    public function testKhaltiLookupMustMatchAmountAndOrder()
    {
        $payment = [
            'id' => 'pay-1',
            'reference' => 'pidx-1',
            'amount_paisa' => 250000,
        ];

        $this->assertTrue(khaltiLookupMatches([
            'pidx' => 'pidx-1',
            'status' => 'Completed',
            'total_amount' => 250000,
            'purchase_order_id' => 'pay-1',
        ], $payment));

        $this->assertFalse(khaltiLookupMatches([
            'pidx' => 'pidx-1',
            'status' => 'Completed',
            'total_amount' => 100,
            'purchase_order_id' => 'pay-1',
        ], $payment));

        $this->assertFalse(khaltiLookupMatches([
            'pidx' => 'pidx-1',
            'status' => 'Pending',
            'total_amount' => 250000,
            'purchase_order_id' => 'pay-1',
        ], $payment));
    }
}
