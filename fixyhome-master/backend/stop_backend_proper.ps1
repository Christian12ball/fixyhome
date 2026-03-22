# Script pour arrêter proprement le backend FixyHome
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Arrêt propre du backend FixyHome" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Rechercher les processus sur le port 8080
Write-Host "1. Recherche des processus sur le port 8080..." -ForegroundColor Yellow
$port = 8080
$processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue

if ($processes) {
    Write-Host "Processus trouvés sur le port $port:" -ForegroundColor Red
    foreach ($process in $processes) {
        $pid = $process.OwningProcess
        $processName = (Get-Process -Id $pid -ErrorAction SilentlyContinue).ProcessName
        Write-Host "  - PID: $pid ($processName)" -ForegroundColor Red
    }
} else {
    Write-Host "Aucun processus trouvé sur le port $port" -ForegroundColor Green
}

# 2. Arrêter les processus sur le port 8080
Write-Host ""
Write-Host "2. Arrêt des processus sur le port 8080..." -ForegroundColor Yellow
if ($processes) {
    foreach ($process in $processes) {
        $pid = $process.OwningProcess
        try {
            Stop-Process -Id $pid -Force -ErrorAction Stop
            Write-Host "Processus $pid arrêté avec succès" -ForegroundColor Green
        } catch {
            Write-Host "Erreur lors de l'arrêt du processus $pid : $_" -ForegroundColor Red
        }
    }
}

# 3. Attendre un peu
Write-Host ""
Write-Host "3. Attente de libération du port..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

# 4. Vérifier que le port est bien libre
Write-Host ""
Write-Host "4. Vérification que le port est libre..." -ForegroundColor Yellow
$remainingProcesses = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
if ($remainingProcesses) {
    Write-Host "ATTENTION: Des processus sont encore actifs sur le port $port" -ForegroundColor Red
    foreach ($process in $remainingProcesses) {
        $pid = $process.OwningProcess
        Write-Host "  - PID: $pid" -ForegroundColor Red
    }
} else {
    Write-Host "Port $port confirmé libre" -ForegroundColor Green
}

# 5. Arrêter les processus Java restants (optionnel)
Write-Host ""
Write-Host "5. Arrêt des processus Java restants..." -ForegroundColor Yellow
$javaProcesses = Get-Process -Name java -ErrorAction SilentlyContinue
if ($javaProcesses) {
    Write-Host "Processus Java trouvés:" -ForegroundColor Yellow
    foreach ($javaProcess in $javaProcesses) {
        Write-Host "  - PID: $($javaProcess.Id) ($($javaProcess.ProcessName))" -ForegroundColor Yellow
        try {
            Stop-Process -Id $javaProcess.Id -Force -ErrorAction Stop
            Write-Host "Processus Java $($javaProcess.Id) arrêté" -ForegroundColor Green
        } catch {
            Write-Host "Erreur lors de l'arrêt du processus Java $($javaProcess.Id)" -ForegroundColor Red
        }
    }
} else {
    Write-Host "Aucun processus Java trouvé" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Backend arrêté avec succès" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Read-Host "Appuyez sur Entrée pour quitter"
