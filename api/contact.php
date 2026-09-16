<?php
// 865Dev Secure Lead Intake Endpoint
header('Content-Type: application/json; charset=utf-8');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
    exit;
}

// 1. Anti-spam honeypot check
$honeypot = isset($_POST['website_url_hp']) ? trim($_POST['website_url_hp']) : '';
if (!empty($honeypot)) {
    // Silently drop bot submissions
    echo json_encode(['status' => 'success', 'message' => 'Request received']);
    exit;
}

// 2. Extract and sanitize input fields
$fullName        = isset($_POST['fullName']) ? htmlspecialchars(trim($_POST['fullName'])) : '';
$businessName    = isset($_POST['businessName']) ? htmlspecialchars(trim($_POST['businessName'])) : '';
$phone           = isset($_POST['phone']) ? htmlspecialchars(trim($_POST['phone'])) : '';
$email           = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
$tradeType       = isset($_POST['tradeType']) ? htmlspecialchars(trim($_POST['tradeType'])) : 'General Inquiry';
$projectDetails  = isset($_POST['projectDetails']) ? htmlspecialchars(trim($_POST['projectDetails'])) : 'None provided';
$estimateTotal   = isset($_POST['estimateTotal']) ? htmlspecialchars(trim($_POST['estimateTotal'])) : '$1,500';

// 3. Validation
if (empty($fullName) || empty($businessName) || empty($phone) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Please fill out all required fields with a valid email.']);
    exit;
}

// 4. Recipient and Email Composition
$to = 'support@865dev.com';
$subject = "⚡ New 865Dev Lead: {$businessName} ({$fullName})";

$messageBody = "
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #0F172A; background-color: #F8FAFC; margin: 0; padding: 20px; }
    .card { background: #FFFFFF; max-width: 600px; margin: 0 auto; border-radius: 12px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05); }
    .header { background: #0F172A; color: #FFFFFF; padding: 24px; text-align: left; border-bottom: 3px solid #FF5722; }
    .header h2 { margin: 0; font-size: 20px; font-weight: 700; }
    .badge { display: inline-block; background: #FF5722; color: #FFFFFF; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 4px; margin-top: 6px; text-transform: uppercase; }
    .content { padding: 24px; }
    .item { margin-bottom: 16px; border-bottom: 1px solid #F1F5F9; padding-bottom: 12px; }
    .item:last-child { border-bottom: none; }
    .label { font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
    .val { font-size: 16px; color: #0F172A; font-weight: 500; }
    .val a { color: #FF5722; text-decoration: none; font-weight: 700; }
    .estimate { background: #FFF7ED; border: 1px solid #FFEDD5; border-radius: 8px; padding: 12px 16px; color: #EA580C; font-weight: 700; font-size: 18px; display: inline-block; margin-top: 4px; }
    .footer { font-size: 12px; color: #94A3B8; text-align: center; padding: 16px; background: #F8FAFC; border-top: 1px solid #E2E8F0; }
  </style>
</head>
<body>
  <div class='card'>
    <div class='header'>
      <h2>New Quote Request Received</h2>
      <span class='badge'>865Dev Lead Alert</span>
    </div>
    <div class='content'>
      <div class='item'>
        <div class='label'>Client Name</div>
        <div class='val'>{$fullName}</div>
      </div>
      <div class='item'>
        <div class='label'>Business Name</div>
        <div class='val'><strong>{$businessName}</strong></div>
      </div>
      <div class='item'>
        <div class='label'>Phone Number</div>
        <div class='val'><a href='tel:{$phone}'>{$phone}</a></div>
      </div>
      <div class='item'>
        <div class='label'>Email Address</div>
        <div class='val'><a href='mailto:{$email}'>{$email}</a></div>
      </div>
      <div class='item'>
        <div class='label'>Business Category</div>
        <div class='val'>{$tradeType}</div>
      </div>
      <div class='item'>
        <div class='label'>Custom Calculator Estimate</div>
        <div class='estimate'>{$estimateTotal}</div>
      </div>
      <div class='item'>
        <div class='label'>Project Details & Notes</div>
        <div class='val' style='white-space: pre-wrap; font-size: 14px; background: #F8FAFC; padding: 12px; border-radius: 6px; border: 1px solid #E2E8F0;'>{$projectDetails}</div>
      </div>
    </div>
    <div class='footer'>
      Received via 865dev.com lead intake engine on " . date('F j, Y, g:i a') . " EST
    </div>
  </div>
</body>
</html>
";

// 5. Headers
$headers = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-type: text/html; charset=UTF-8';
$headers[] = 'From: 865Dev Web Intake <support@865dev.com>';
$headers[] = "Reply-To: {$fullName} <{$email}>";
$headers[] = 'X-Mailer: PHP/' . phpversion();

// 6. Send email
$mailSent = @mail($to, $subject, $messageBody, implode("\r\n", $headers));

if ($mailSent) {
    echo json_encode([
        'status'  => 'success',
        'message' => 'Thank you! Your quote request has been dispatched to a Knoxville developer.'
    ]);
} else {
    // Even if local mail server reports an error, log and return graceful response
    error_log("865Dev Mail Error: Failed to send lead email for {$businessName}");
    echo json_encode([
        'status'  => 'success',
        'message' => 'Request received. We will contact you shortly.'
    ]);
}
