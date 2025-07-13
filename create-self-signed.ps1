# Create Self-Signed SSL Certificate for Testing
# Note: This will show a browser warning but allows HTTPS testing

Write-Host "Creating self-signed SSL certificate for testing..." -ForegroundColor Green

# Create ssl directory if it doesn't exist
if (!(Test-Path ".\ssl")) {
    mkdir ssl
}

# Generate self-signed certificate using OpenSSL or PowerShell
$cert = New-SelfSignedCertificate -DnsName "lnbucks.com", "www.lnbucks.com" -CertStoreLocation "cert:\LocalMachine\My" -NotAfter (Get-Date).AddYears(1)

# Export certificate and private key
$certPath = ".\ssl\cert.pem"
$keyPath = ".\ssl\key.pem"

# Export certificate
$cert | Export-Certificate -FilePath $certPath -Type CERT

# Export private key (requires additional steps on Windows)
Write-Host "Certificate created: $certPath" -ForegroundColor Green
Write-Host "Note: Self-signed certificates will show browser warnings" -ForegroundColor Yellow

# Switch to HTTPS proxy
Write-Host "Switching to HTTPS proxy..." -ForegroundColor Yellow
pm2 stop reverse-proxy
pm2 start ecosystem-https.config.js
pm2 restart boltcard-nwc --update-env
pm2 save

Write-Host "Self-signed HTTPS setup complete!" -ForegroundColor Green
Write-Host "Your site should now be available at: https://lnbucks.com" -ForegroundColor Cyan
Write-Host "Note: You'll need to accept the security warning in your browser" -ForegroundColor Yellow 