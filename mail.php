<?php

add_action( 'wp_ajax_contactForm', 'contactForm' ); 
add_action( 'wp_ajax_nopriv_contactForm', 'contactForm' );
function contactForm() {

require_once ( '../../../wp-includes/PHPMailer/Exception.php');
require_once ( '../../../wp-includes/PHPMailer/PHPMailer.php');
require_once ( '../../../wp-includes/PHPMailer/SMTP.php');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

$textTitle = '';
$textBody = '';

if ($_POST['theForm'] === 'applicationForm') {
    $textName = 'fail';
    $textTitle = 'Grill-oint: Fail';
    $textBody = 'Новый фаил';
    
    // $ext = PHPMailer::mb_pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
    $uploadfile = tempnam(sys_get_temp_dir(), hash('sha256', $_FILES['file']['name'])) . '.' . $ext;
    move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);

    if ( isset($_POST["phoneContacts"]) && trim($_POST["phoneContacts"]) !== '' ) {
        $phone = htmlspecialchars( trim($_POST["phoneContacts"]) );
    }
    if ( isset($_POST["emailContacts"]) && trim($_POST["emailContacts"]) !== '' ) {
        $email = htmlspecialchars( trim($_POST["emailContacts"]) );
    }
    if ( isset($_POST["textContacts"]) && trim($_POST["textContacts"]) !== '' ) {
        $text = htmlspecialchars( trim($_POST["textContacts"]) );
    }
    $textBody = '<br> Вопрос: '. $text .'<br> Телефон:' . $phone . '<br> Емаил: ' . $email;
}

if ($_POST['theForm'] === 'questionForm') { 
    if ( isset($_POST["mesName"]) && trim($_POST["mesName"]) !== '' ) {
        $mesName = htmlspecialchars( trim($_POST["mesName"]) );
    }
    if ( isset($_POST["mesPhone"]) && trim($_POST["mesPhone"]) !== '' ) {
        $mesPhone = htmlspecialchars( trim($_POST["mesPhone"]) );
    }
    if ( isset($_POST["mesMail"]) && trim($_POST["mesMail"]) !== '' ) {
        $mesMail = htmlspecialchars( trim($_POST["mesMail"]) );
    }
    if ( isset($_POST["message"]) && trim($_POST["message"]) !== '' ) {
        $message = htmlspecialchars( trim($_POST["message"]) );
    }
}

$mail = new PHPMailer(true);

// Server settings
$mail->SMTPDebug = the_field( 'smtpdebug', 'option' );
$mail->isSMTP();
$mail->CharSet    = 'UTF-8';
$mail->Host       = the_field( 'host', 'option' );
$mail->SMTPAuth   = true;
$mail->Username   = the_field( 'username', 'option' );
$mail->Password   = the_field( 'password', 'option' );
$mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
$mail->Port       = the_field( 'port', 'option' );                                 
// Recipients
$mail->setFrom(the_field( 'email_from', 'option' ), $textName);

if ( have_rows( 'email_to', 'option' ) ) : 
    while ( have_rows( 'email_to', 'option' ) ) : the_row(); 
        $mail->addAddress(the_sub_field( 'email' ));
    endwhile; 
endif;

// Attachments
if ($_FILES['file']) {
    $mail->addAttachment($uploadfile, $_FILES['file']['name']);  
}

// Content
$mail->isHTML(true);
$mail->Subject = $textTitle;
$mail->Body = $textBody;
$mail->send();


}
?>