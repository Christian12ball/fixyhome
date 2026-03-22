# Script PowerShell pour arrêter les processus sur le port 8080
Write-Host "Recherche des processus sur le port 8080..." -ForegroundColor Yellow

$processes = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue

if ($processes) {
    foreach ($process in $processes) {
        $pid = $process.OwningProcess
        $processName = (Get-Process -Id $pid -ErrorAction SilentlyContinue).ProcessName
        Write-Host "Arrêt du processus $processName (PID: $pid)..." -ForegroundColor Red
        Stop-Process -Id $pid -Force
    }
    
    Write-Host "Vérification..." -ForegroundColor Yellow
    Start-Sleep -Seconds 2
    
    $remaining = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
    if (-not $remaining) {
        Write-Host "Port 8080 libéré avec succès !" -ForegroundColor Green
    } else {
        Write-Host "Le port 8080 est encore utilisé." -ForegroundColor Red
    }
} else {
    Write-Host "Aucun processus trouvé sur le port 8080." -ForegroundColor Green
}

Write-Host "Appuyez sur Entrée pour continuer..." -ForegroundColor Cyan
Read-Host
