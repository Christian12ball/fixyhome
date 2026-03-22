@echo off
echo Arrêt des processus sur le port 8080...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080') do (
    echo Arrêt du processus PID: %%a
    taskkill /F /PID %%a
)

echo Vérification...
netstat -ano | findstr :8080
if %errorlevel% neq 0 (
    echo Port 8080 libéré avec succès !
) else (
    echo Le port 8080 est encore utilisé.
)

pause
