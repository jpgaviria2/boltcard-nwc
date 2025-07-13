# SSL Certificate Setup Script using DNS Challenge
# This method doesn't require port 80 to be open

Write-Host "Setting up SSL certificates for lnbucks.com using DNS challenge..." -ForegroundColor Green

# Add Python Scripts to PATH
$env:PATH += ";C:\Users\JuanPabloGaviria\AppData\Roaming\Python\Python313\Scripts"

# Get SSL certificates using DNS challenge
Write-Host "Getting SSL certificates from Let's Encrypt using DNS challenge..." -ForegroundColor Yellow
Write-Host "This will require manual DNS record creation." -ForegroundColor Yellow

certbot certonly --manual --preferred-challenges dns -d lnbucks.com -d www.lnbucks.com --email admin@lnbucks.com --agree-tos

# Check if certificates were created
if (Test-Path "C:\Certbot\live\lnbucks.com\fullchain.pem") {
    Write-Host "SSL certificates created successfully!" -ForegroundColor Green
    
    # Copy certificates to our ssl directory
    Write-Host "Copying certificates..." -ForegroundColor Yellow
    Copy-Item "C:\Certbot\live\lnbucks.com\fullchain.pem" ".\ssl\cert.pem" -Force
    Copy-Item "C:\Certbot\live\lnbucks.com\privkey.pem" ".\ssl\key.pem" -Force
    
    Write-Host "Certificates copied to ./ssl/" -ForegroundColor Green
    Write-Host "Now switching to HTTPS proxy..." -ForegroundColor Yellow
    
    # Switch to HTTPS proxy
    pm2 stop reverse-proxy
    pm2 start ecosystem-https.config.js
    pm2 restart boltcard-nwc --update-env
    pm2 save
    
    Write-Host "HTTPS setup complete!" -ForegroundColor Green
    Write-Host "Your site should now be available at: https://lnbucks.com" -ForegroundColor Cyan
} else {
    Write-Host "Failed to create SSL certificates. Check the logs above." -ForegroundColor Red
} 