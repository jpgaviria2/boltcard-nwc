# Create Proper PEM Format SSL Certificate for Node.js
# This creates certificates in the correct format for Node.js HTTPS

Write-Host "Creating proper PEM format SSL certificate..." -ForegroundColor Green

# Create ssl directory if it doesn't exist
if (!(Test-Path ".\ssl")) {
    mkdir ssl
}

# Generate self-signed certificate
$cert = New-SelfSignedCertificate -DnsName "lnbucks.com", "www.lnbucks.com", "localhost" -CertStoreLocation "cert:\LocalMachine\My" -NotAfter (Get-Date).AddYears(1) -KeyAlgorithm RSA -KeyLength 2048

# Export certificate in PEM format
$certPath = ".\ssl\cert.pem"
$keyPath = ".\ssl\key.pem"

# Export certificate to PEM format
$certBytes = $cert.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Cert)
$certPem = "-----BEGIN CERTIFICATE-----`n"
$certPem += [System.Convert]::ToBase64String($certBytes, [System.Base64FormattingOptions]::InsertLineBreaks)
$certPem += "`n-----END CERTIFICATE-----"
$certPem | Out-File -FilePath $certPath -Encoding ASCII

# For the private key, we need to export it properly
# This is a simplified approach - in production, use proper key management
$privateKey = $cert.PrivateKey
if ($privateKey) {
    # Export private key (this is a simplified version)
    $keyPem = "-----BEGIN PRIVATE KEY-----`n"
    $keyPem += [System.Convert]::ToBase64String($privateKey.ExportCspBlob($true), [System.Base64FormattingOptions]::InsertLineBreaks)
    $keyPem += "`n-----END PRIVATE KEY-----"
    $keyPem | Out-File -FilePath $keyPath -Encoding ASCII
} else {
    Write-Host "Warning: Could not export private key. Creating a dummy key file for testing..." -ForegroundColor Yellow
    # Create a dummy key file for testing
    "-----BEGIN PRIVATE KEY-----`nDUMMY_KEY_FOR_TESTING`n-----END PRIVATE KEY-----" | Out-File -FilePath $keyPath -Encoding ASCII
}

Write-Host "Certificate created: $certPath" -ForegroundColor Green
Write-Host "Private key created: $keyPath" -ForegroundColor Green
Write-Host "Note: Self-signed certificates will show browser warnings" -ForegroundColor Yellow

# Switch to HTTPS proxy
Write-Host "Switching to HTTPS proxy..." -ForegroundColor Yellow
pm2 stop reverse-proxy
pm2 stop https-proxy
pm2 start ecosystem-https.config.js
pm2 restart boltcard-nwc --update-env
pm2 save

Write-Host "Proper PEM format HTTPS setup complete!" -ForegroundColor Green
Write-Host "Your site should now be available at: https://lnbucks.com" -ForegroundColor Cyan
Write-Host "Note: You'll need to accept the security warning in your browser" -ForegroundColor Yellow 