# Script pour arrêter les processus sur le port 8080
$port = 8080
$processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue

if ($processes) {
    Write-Host "Processus trouvés sur le port $port :" -ForegroundColor Yellow
    foreach ($process in $processes) {
        $pid = $process.OwningProcess
        $processName = (Get-Process -Id $pid -ErrorAction SilentlyContinue).ProcessName
        Write-Host "PID: $pid, Process: $processName" -ForegroundColor Red
        
        try {
            Stop-Process -Id $pid -Force -ErrorAction Stop
            Write-Host "Processus $pid arrêté avec succès" -ForegroundColor Green
        } catch {
            Write-Host "Erreur lors de l'arrêt du processus $pid : $_" -ForegroundColor Red
        }
    }
} else {
    Write-Host "Aucun processus trouvé sur le port $port" -ForegroundColor Green
}

Write-Host "Port $port maintenant libre" -ForegroundColor Cyan
