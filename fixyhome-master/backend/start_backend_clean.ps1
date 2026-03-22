# Script pour démarrer le backend proprement
Write-Host "Démarrage du backend FixyHome..." -ForegroundColor Cyan

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
Write-Host "2. Attente de libération du port..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

# 3. Vérifier que le port est bien libre
$processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
if ($processes) {
    Write-Host "ERREUR: Le port $port est toujours utilisé" -ForegroundColor Red
    exit 1
} else {
    Write-Host "Port $port confirmé libre" -ForegroundColor Green
}

# 4. Démarrer le backend
Write-Host "3. Démarrage du backend..." -ForegroundColor Cyan
Set-Location -Path $PSScriptRoot

# Démarrer Maven en arrière-plan
Start-Process -FilePath "mvn" -ArgumentList "spring-boot:run" -NoNewWindow

Write-Host "Backend démarré en arrière-plan" -ForegroundColor Green
Write-Host "Vous pouvez vérifier les logs avec: Get-Process java | Select-Object Name, Id" -ForegroundColor Cyan
Write-Host "Pour arrêter le backend: taskkill /F /IM java.exe" -ForegroundColor Yellow
