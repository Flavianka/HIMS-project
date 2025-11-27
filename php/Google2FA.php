<?php

class Google2FA
{
    /**
     * Generate a random secret key in base32 format
     */
    public function generateSecretKey($length = 16)
    {
        $secret = '';
        $validChars = $this->getBase32LookupTable();
        
        // Generate random bytes and convert to base32
        for ($i = 0; $i < $length; $i++) {
            $secret .= $validChars[random_int(0, 31)];
        }
        
        return $secret;
    }

    /**
     * Verify a 2FA code
     */
    public function verifyKey($secret, $code, $window = 4)
    {
        $timeSlice = floor(time() / 30);
        
        for ($i = -$window; $i <= $window; $i++) {
            $calculatedCode = $this->getCode($secret, $timeSlice + $i);
            if (hash_equals($calculatedCode, $code)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Calculate the code for a specific time slice
     */
    private function getCode($secret, $timeSlice)
    {
        $secretKey = $this->base32Decode($secret);
        $time = chr(0) . chr(0) . chr(0) . chr(0) . pack('N*', $timeSlice);
        $hm = hash_hmac('SHA1', $time, $secretKey, true);
        $offset = ord(substr($hm, -1)) & 0x0F;
        $hashpart = substr($hm, $offset, 4);
        
        $value = unpack('N', $hashpart);
        $value = $value[1] & 0x7FFFFFFF;
        
        $modulo = pow(10, 6);
        
        return str_pad($value % $modulo, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Base32 decoding
     */
    private function base32Decode($secret)
    {
        if (empty($secret)) {
            return '';
        }
        
        $base32chars = $this->getBase32LookupTable();
        $base32charsFlipped = array_flip($base32chars);
        
        $paddingCharCount = substr_count($secret, '=');
        $allowedValues = [6, 4, 3, 1, 0];
        
        if (!in_array($paddingCharCount, $allowedValues)) {
            return false;
        }
        
        for ($i = 0; $i < 4; $i++) {
            if ($paddingCharCount == $allowedValues[$i] &&
                substr($secret, -($allowedValues[$i])) != str_repeat('=', $allowedValues[$i])) {
                return false;
            }
        }
        
        $secret = str_replace('=', '', $secret);
        $secret = str_split($secret);
        $binaryString = '';
        
        for ($i = 0; $i < count($secret); $i = $i + 8) {
            $x = '';
            
            if (!in_array($secret[$i], $base32chars)) {
                return false;
            }
            
            for ($j = 0; $j < 8; $j++) {
                $x .= str_pad(base_convert(@$base32charsFlipped[@$secret[$i + $j]], 10, 2), 5, '0', STR_PAD_LEFT);
            }
            
            $eightBits = str_split($x, 8);
            
            for ($z = 0; $z < count($eightBits); $z++) {
                $binaryString .= (($y = chr(base_convert($eightBits[$z], 2, 10))) || ord($y) == 48) ? $y : '';
            }
        }
        
        return $binaryString;
    }

    /**
     * Get base32 character lookup table
     */
    private function getBase32LookupTable()
    {
        return [
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', // 7
            'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', // 15
            'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', // 23
            'Y', 'Z', '2', '3', '4', '5', '6', '7', // 31
            '='  // padding char
        ];
    }

    /**
     * Generate QR code URL for Google Authenticator
     */
    public function getQRCodeUrl($issuer, $accountName, $secret)
    {
        $url = 'otpauth://totp/';
        $url .= urlencode($issuer) . ':' . urlencode($accountName);
        $url .= '?secret=' . $secret;
        $url .= '&issuer=' . urlencode($issuer);
        $url .= '&algorithm=SHA1';
        $url .= '&digits=6';
        $url .= '&period=30';
        
        return $url;
    }
}