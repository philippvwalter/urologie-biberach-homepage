<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

const RECAPTCHA_SECRET_KEY = '6Lfs83gtAAAAAOj7Bi9obVb-Afs2kQIRuuQCr-IN';

$empfaenger = 'info@urologie-biberach.de';
$absenderDomain = 'urologie-biberach.de';

function recaptcha_verify(string $response, string $remoteIp): bool
{
    if ($response === '') {
        return false;
    }

    $params = http_build_query([
        'secret' => RECAPTCHA_SECRET_KEY,
        'response' => $response,
        'remoteip' => $remoteIp,
    ]);

    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => 'Content-Type: application/x-www-form-urlencoded',
            'content' => $params,
            'timeout' => 10,
        ],
    ]);

    $result = @file_get_contents('https://www.google.com/recaptcha/api/siteverify', false, $context);
    if ($result === false) {
        return false;
    }

    $data = json_decode($result, true);
    return is_array($data) && ($data['success'] ?? false) === true;
}

function respond(bool $success, string $message): void {
    http_response_code($success ? 200 : 400);
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Ungültige Anfrage.');
}

// Honeypot: Bots füllen dieses versteckte Feld aus, echte Nutzer nicht.
if (!empty($_POST['website'] ?? '')) {
    respond(true, 'Danke für Ihre Anfrage.');
}

$anliegen = trim((string) ($_POST['anliegen'] ?? ''));
$name = trim((string) ($_POST['name'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$nachricht = trim((string) ($_POST['nachricht'] ?? ''));

$erlaubteAnliegen = ['Terminanfrage', 'Rezeptanfrage', 'Bewerbung', 'Sonstiges'];

if ($anliegen === '' || !in_array($anliegen, $erlaubteAnliegen, true)) {
    respond(false, 'Bitte wählen Sie ein gültiges Anliegen.');
}
if ($name === '' || mb_strlen($name) > 200) {
    respond(false, 'Bitte geben Sie einen gültigen Namen an.');
}
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 200) {
    respond(false, 'Bitte geben Sie eine gültige E-Mail-Adresse an.');
}
if ($nachricht === '' || mb_strlen($nachricht) > 5000) {
    respond(false, 'Bitte geben Sie eine Nachricht ein.');
}

$recaptchaResponse = (string) ($_POST['g-recaptcha-response'] ?? '');
$remoteIp = (string) ($_SERVER['REMOTE_ADDR'] ?? '');

if (!recaptcha_verify($recaptchaResponse, $remoteIp)) {
    respond(false, 'Bitte bestätigen Sie das reCAPTCHA-Kästchen „Ich bin kein Roboter".');
}

// Header-Injection verhindern: Zeilenumbrüche aus Header-relevanten Feldern entfernen.
$saubereZeile = static fn(string $wert): string => trim(str_replace(["\r", "\n"], '', $wert));

$name = $saubereZeile($name);
$email = $saubereZeile($email);
$anliegen = $saubereZeile($anliegen);

$betreff = "Praxisanfrage: {$anliegen} – {$name}";

$body = "Neue Anfrage über die Website:\n\n";
$body .= "Anliegen: {$anliegen}\n";
$body .= "Name: {$name}\n";
$body .= "E-Mail: {$email}\n\n";
$body .= "Nachricht:\n{$nachricht}\n";

$headers = [];
$headers[] = "From: Website-Kontaktformular <noreply@{$absenderDomain}>";
$headers[] = "Reply-To: {$name} <{$email}>";
$headers[] = 'Content-Type: text/plain; charset=UTF-8';
$headers[] = 'X-Mailer: PHP/' . phpversion();

$erfolg = mail($empfaenger, $betreff, $body, implode("\r\n", $headers));

if ($erfolg) {
    respond(true, 'Vielen Dank! Ihre Anfrage wurde erfolgreich versendet.');
}

respond(false, 'Die Anfrage konnte nicht versendet werden. Bitte versuchen Sie es später erneut oder schreiben Sie uns direkt an info@urologie-biberach.de.');
