<?php
// Include the Google2FA library manually since you might not have Composer
require_once 'Google2FA.php'; // You'll need to download this

class TwoFactorAuth {
    private $google2fa;
    
    public function __construct() {
        $this->google2fa = new Google2FA();
    }
    
    // Generate a new secret key for a user
    public function generateSecret() {
        return $this->google2fa->generateSecretKey();
    }
    
    // Generate QR code URL for Google Authenticator
    public function getQRCodeUrl($companyName, $companyEmail, $secret) {
        return $this->google2fa->getQRCodeUrl(
            $companyName,
            $companyEmail,
            $secret
        );
    }
    
    // Verify the 2FA code
    public function verifyCode($secret, $code) {
        try {
            return $this->google2fa->verifyKey($secret, $code);
        } catch (Exception $e) {
            error_log("2FA verification error: " . $e->getMessage());
            return false;
        }
    }
    
    // Generate backup codes
    public function generateBackupCodes($count = 8) {
        $backupCodes = [];
        for ($i = 0; $i < $count; $i++) {
            $backupCodes[] = strtoupper(bin2hex(random_bytes(5))); // 10 character codes
        }
        return $backupCodes;
    }
}
?>