<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();


function sendMail($to, $subject, $messageBody) {
    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->SMTPDebug = SMTP::DEBUG_OFF; 
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = $_ENV['mail'];
        $mail->Password   = $_ENV['mail_password'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; 
        $mail->Port       = 587;           
        
        $mail->setFrom($_ENV['mail'], 'GoGain');
        $mail->addAddress($to); 
        
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $messageBody;
        $mail->AltBody = strip_tags($messageBody);

        $mail->send();
        return [
            'success' => true, 
            'message' => 'Message has been sent successfully'
        ];
    } catch (Exception $e) {
        return [
            'success' => false, 
            'message' => "Message could not be sent. Mailer Error: {$mail->ErrorInfo}",
            'error_details' => $e->getMessage()
        ];
    }
}
?>
