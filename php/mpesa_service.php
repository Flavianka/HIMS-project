<?php
class MpesaService {
    private $consumerKey;
    private $consumerSecret;
    private $businessShortCode;
    private $passkey;
    
    public function __construct() {
        $this->consumerKey = "GdgXi5vAd59sAmvd4kWHwsaUs7GZ0WVVLDWVAdo6Js9h7Ggd";
        $this->consumerSecret = "KaYp4GEOtMa9FOQzbivquY1btbMEJGO8cBszLR4kFs33cwSxVvqYt0dT18hGHnQ5";
        $this->businessShortCode = "174379";
        $this->passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
    }
    
    public function getAccessToken() {
        $credentials = base64_encode($this->consumerKey . ':' . $this->consumerSecret);
        $url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
        
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HTTPHEADER, [
            'Authorization: Basic ' . $credentials,
            'Content-Type: application/json'
        ]);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_TIMEOUT, 30);
        
        $response = curl_exec($curl);
        $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        $curlError = curl_error($curl);
        curl_close($curl);
        
        error_log("=== M-Pesa Access Token Request ===");
        error_log("HTTP Code: " . $httpCode);
        error_log("CURL Error: " . $curlError);
        error_log("Response: " . $response);
        
        if ($httpCode !== 200) {
            throw new Exception("Failed to get access token. HTTP Code: " . $httpCode . " - Response: " . $response);
        }
        
        $data = json_decode($response, true);
        
        if (isset($data['access_token'])) {
            error_log("Access Token: " . $data['access_token']);
            return $data['access_token'];
        } else {
            throw new Exception("Access token not found in response: " . $response);
        }
    }
    
    public function initiateSTKPush($phone, $amount, $reference) {
    error_log("=== M-Pesa STK Push Request ===");
    error_log("Phone Received: " . $phone);
    error_log("Amount: " . $amount);
    error_log("Reference: " . $reference);
    
    // Get access token first
    $accessToken = $this->getAccessToken();
    
    // Generate timestamp and password
    $timestamp = date('YmdHis');
    $password = base64_encode($this->businessShortCode . $this->passkey . $timestamp);
    
    // Phone should already be in 254 format from JavaScript
    // But let's ensure it's clean
    $formattedPhone = preg_replace('/[^0-9]/', '', $phone);
    
    // Double-check it's in 254 format (should be from JS conversion)
    if (strlen($formattedPhone) === 10 && $formattedPhone[0] === '0') {
        // Convert 07 to 254 format as fallback
        $formattedPhone = '254' . substr($formattedPhone, 1);
    }
    
    error_log("Final Phone Sent to M-Pesa: " . $formattedPhone);
    
    // Use a valid callback URL for sandbox testing
    $callbackUrl = "https://sandbox.safaricom.co.ke/mpesa/callback";
    
    $requestData = [
        "BusinessShortCode" => $this->businessShortCode,
        "Password" => $password,
        "Timestamp" => $timestamp,
        "TransactionType" => "CustomerPayBillOnline",
        "Amount" => $amount,
        "PartyA" => $formattedPhone,
        "PartyB" => $this->businessShortCode,
        "PhoneNumber" => $formattedPhone,
        "CallBackURL" => $callbackUrl,
        "AccountReference" => "HyperNest",
        "TransactionDesc" => "Payment for sale: " . $reference
    ];
    
    error_log("=== M-Pesa STK Push Data ===");
    error_log("Request Data: " . json_encode($requestData, JSON_PRETTY_PRINT));
    
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest');
    curl_setopt($curl, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $accessToken,
        'Content-Type: application/json'
    ]);
    curl_setopt($curl, CURLOPT_POST, 1);
    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($requestData));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($curl, CURLOPT_TIMEOUT, 30);
    
    $response = curl_exec($curl);
    $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    $curlError = curl_error($curl);
    curl_close($curl);
    
    // Log the response
    error_log("=== M-Pesa STK Push Response ===");
    error_log("HTTP Code: " . $httpCode);
    error_log("CURL Error: " . $curlError);
    error_log("Response: " . $response);
    
    if ($httpCode !== 200) {
        throw new Exception("STK Push failed. HTTP Code: " . $httpCode . " - Response: " . $response);
    }
    
    $result = json_decode($response, true);
    
    if (isset($result['ResponseCode']) && $result['ResponseCode'] == "0") {
        return [
            'success' => true,
            'checkoutRequestID' => $result['CheckoutRequestID'],
            'merchantRequestID' => $result['MerchantRequestID'],
            'responseDescription' => $result['ResponseDescription']
        ];
    } else {
        $errorMessage = $result['errorMessage'] ?? ($result['ResponseDescription'] ?? 'Unknown error');
        throw new Exception($errorMessage);
    }
  }
}
?>