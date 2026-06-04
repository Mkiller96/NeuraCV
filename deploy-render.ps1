# Deploy NeuraCV Backend to Render.com via API
$token = "rnd_6yLpUP9Ju9tIz3ipo4mTJ3g940TO"
$serviceId = "srv-d8g8c3cp3tds738ahrv0"

$headers = @{
    Authorization = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "===== Deploy NeuraCV a Render.com =====" -ForegroundColor Cyan
Write-Host "Dashboard: https://dashboard.render.com/web/$serviceId" -ForegroundColor Cyan
Write-Host ""

# 1) Disparar deploy
Write-Host "[1/3] Disparando deploy..." -ForegroundColor Yellow
$deployBody = "{}"
try {
    $resp = Invoke-WebRequest -Uri "https://api.render.com/v1/services/$serviceId/deploys" -Method POST -Headers $headers -Body $deployBody -UseBasicParsing
    $deploy = $resp.Content | ConvertFrom-Json
    Write-Host "  OK - Deploy ID: $($deploy.id) Status: $($deploy.status)" -ForegroundColor Green
} catch {
    $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
    $body = $reader.ReadToEnd()
    Write-Host "  ERROR: $body" -ForegroundColor Red
}

# 2) Esperar y ver estado
Start-Sleep -Seconds 15
Write-Host "[2/3] Verificando estado del deploy..." -ForegroundColor Yellow
try {
    $resp = Invoke-WebRequest -Uri "https://api.render.com/v1/services/$serviceId/deploys?limit=1" -Method GET -Headers $headers -UseBasicParsing
    $deploys = $resp.Content | ConvertFrom-Json
    Write-Host "  Estado: $($deploys[0].status) - Creado: $($deploys[0].createdAt)" -ForegroundColor Green
} catch {
    Write-Host "  ERROR al verificar" -ForegroundColor Red
}

# 3) Enlaces útiles
Write-Host "[3/3] Enlaces:" -ForegroundColor Yellow
Write-Host "  Dashboard: https://dashboard.render.com/web/$serviceId" -ForegroundColor Cyan
Write-Host "  Logs: https://dashboard.render.com/web/$serviceId/logs" -ForegroundColor Cyan
Write-Host "  Env Vars: https://dashboard.render.com/web/$serviceId/env" -ForegroundColor Cyan
Write-Host ""

Write-Host "IMPORTANTE: Configura estas variables en el Dashboard (Env Vars):" -ForegroundColor Yellow
Write-Host "  - APP_KEY (generalo con: php artisan key:generate --show)" -ForegroundColor White
Write-Host "  - DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD (de Supabase)" -ForegroundColor White
Write-Host "  - DEEPSEEK_API_KEY" -ForegroundColor White
