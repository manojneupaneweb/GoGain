<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require 'vendor/autoload.php';

/**
 * Send email using Gmail SMTP
 * 
 * @param string $to Recipient email address
 * @param string $subject Email subject
 * @param string $messageBody HTML email content
 * @return array Result array with success status and message
 */
function sendMail($to, $subject, $messageBody) {
    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->SMTPDebug = SMTP::DEBUG_SERVER;
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'randome255@gmail.com';
        $mail->Password   = 'iqnx wdzq vnyw epoh';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; 
        $mail->Port       = 587;           
        
        // Recipients
        $mail->setFrom('randome255@gmail.com', 'GoGain');
        $mail->addAddress($to); 
        
        // Content
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