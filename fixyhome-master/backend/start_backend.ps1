# Script PowerShell pour démarrer le backend FixyHome
Write-Host "Démarrage du backend FixyHome..." -ForegroundColor Cyan

# Vérifier si le port 8080 est utilisé
$processes = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue

if ($processes) {
    Write-Host "Le port 8080 est déjà utilisé. Arrêt des processus..." -ForegroundColor Yellow
    
    foreach ($process in $processes) {
        $pid = $process.OwningProcess
        $processName = (Get-Process -Id $pid -ErrorAction SilentlyContinue).ProcessName
        Write-Host "Arrêt du processus $processName (PID: $pid)..." -ForegroundColor Red
        Stop-Process -Id $pid -Force
    }
    
    Write-Host "Attente de la libération du port..." -ForegroundColor Yellow
    Start-Sleep -Seconds 3
}

Write-Host "Démarrage de Spring Boot..." -ForegroundColor Green
mvn spring-boot:run

Write-Host "Appuyez sur Entrée pour continuer..." -ForegroundColor Cyan
Read-Host
