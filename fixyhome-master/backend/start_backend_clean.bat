@echo off
echo Démarrage du backend FixyHome...
echo.

echo 1. Verification du port 8080...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080') do (
    echo Processus trouve sur le port 8080: %%a
    echo Arret du processus...
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo 2. Attente de liberation du port...
timeout /t 2 /nobreak >nul

echo.
echo 3. Verification que le port est libre...
netstat -ano | findstr :8080
if %errorlevel% equ 0 (
    echo ERREUR: Le port 8080 est toujours utilise
    pause
    exit /b 1
) else (
    echo Port 8080 confirme libre
)

echo.
echo 4. Demarrage du backend...
cd /d "%~dp0"
start "Backend FixyHome" cmd /k "mvn spring-boot:run"

echo.
echo Backend demarre dans une nouvelle fenetre
echo Pour arreter le backend: taskkill /F /IM java.exe
pause
