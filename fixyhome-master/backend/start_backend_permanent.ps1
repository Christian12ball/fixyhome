# Script pour démarrer le backend en mode permanent
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Démarrage permanent du backend FixyHome" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Arrêter les processus sur le port 8080
Write-Host "1. Vérification du port 8080..." -ForegroundColor Yellow
$port = 8080
$processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue

if ($processes) {
    Write-Host "Processus trouvés sur le port $port, arrêt en cours..." -ForegroundColor Red
    foreach ($process in $processes) {
        $pid = $process.OwningProcess
        try {
            Stop-Process -Id $pid -Force -ErrorAction Stop
            Write-Host "Processus $pid arrêté" -ForegroundColor Green
        } catch {
            Write-Host "Erreur lors de l'arrêt du processus $pid" -ForegroundColor Red
        }
    }
} else {
    Write-Host "Port $port déjà libre" -ForegroundColor Green
}

# 2. Attendre un peu pour que le port se libère complètement
Write-Host ""
Write-Host "2. Attente de libération du port..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# 3. Vérifier que le port est bien libre
Write-Host ""
Write-Host "3. Vérification que le port est libre..." -ForegroundColor Yellow
$processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
if ($processes) {
    Write-Host "ERREUR: Le port $port est toujours utilisé" -ForegroundColor Red
    Write-Host "Veuillez arrêter manuellement les processus suivants:" -ForegroundColor Red
    foreach ($process in $processes) {
        $pid = $process.OwningProcess
        $processName = (Get-Process -Id $pid -ErrorAction SilentlyContinue).ProcessName
        Write-Host "  - PID: $pid ($processName)" -ForegroundColor Red
    }
    Read-Host "Appuyez sur Entrée pour quitter"
    exit 1
} else {
    Write-Host "Port $port confirmé libre" -ForegroundColor Green
}

# 4. Démarrer le backend en mode permanent
Write-Host ""
Write-Host "4. Démarrage du backend en mode permanent..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Le backend démarrera et restera actif" -ForegroundColor Green
Write-Host "Pour arrêter: Fermez cette fenêtre ou Ctrl+C" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location -Path $PSScriptRoot

# Démarrer Maven en mode synchrone (garde la fenêtre active)
try {
    mvn spring-boot:run
} catch {
    Write-Host ""
    Write-Host "Erreur lors du démarrage du backend:" -ForegroundColor Red
    Write-Host $_ -ForegroundColor Red
}

Write-Host ""
Write-Host "Backend arrêté" -ForegroundColor Yellow
Read-Host "Appuyez sur Entrée pour quitter"
