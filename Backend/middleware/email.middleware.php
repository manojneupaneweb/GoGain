<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require_once __DIR__ . '/../vendor/autoload.php';

function sendMail($to, $subject, $messageBody) {
    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->SMTPDebug = SMTP::DEBUG_OFF; 
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = $_ENV['MAIL_USER'];
        $mail->Password   = $_ENV['MAIL_PASSWORD'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; 
        $mail->Port       = 587;           
        
        $mail->setFrom($_ENV['MAIL_USER'], 'GoGain');
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
            error_log($e->getMessage());
        error_log($mail->ErrorInfo . ' ' . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Message could not be sent.'
        ];
    }
}
?>
