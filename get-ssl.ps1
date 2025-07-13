# SSL Certificate Setup Script
# Run this script as Administrator

Write-Host "Setting up SSL certificates for lnbucks.com..." -ForegroundColor Green

# Add Python Scripts to PATH
$env:PATH += ";C:\Users\JuanPabloGaviria\AppData\Roaming\Python\Python313\Scripts"

# Stop the reverse proxy temporarily to free up port 80
Write-Host "Stopping reverse proxy..." -ForegroundColor Yellow
pm2 stop reverse-proxy

# Wait a moment
Start-Sleep -Seconds 3

# Get SSL certificates
Write-Host "Getting SSL certificates from Let's Encrypt..." -ForegroundColor Yellow
certbot certonly --standalone -d lnbucks.com -d www.lnbucks.com --email admin@lnbucks.com --agree-tos --non-interactive

# Check if certificates were created
if (Test-Path "C:\Certbot\live\lnbucks.com\fullchain.pem") {
    Write-Host "SSL certificates created successfully!" -ForegroundColor Green
    
    # Copy certificates to our ssl directory
    Write-Host "Copying certificates..." -ForegroundColor Yellow
    Copy-Item "C:\Certbot\live\lnbucks.com\fullchain.pem" ".\ssl\cert.pem" -Force
    Copy-Item "C:\Certbot\live\lnbucks.com\privkey.pem" ".\ssl\key.pem" -Force
    
    Write-Host "Certificates copied to ./ssl/" -ForegroundColor Green
} else {
    Write-Host "Failed to create SSL certificates. Check the logs above." -ForegroundColor Red
}

# Restart the reverse proxy
Write-Host "Restarting reverse proxy..." -ForegroundColor Yellow
pm2 start reverse-proxy

Write-Host "SSL setup complete!" -ForegroundColor Green
Write-Host "Your site should now be available at: https://lnbucks.com" -ForegroundColor Cyan 