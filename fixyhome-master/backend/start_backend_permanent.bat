@echo off
echo ========================================
echo Demarrage permanent du backend FixyHome
echo ========================================
echo.

echo 1. Verification du port 8080...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080') do (
    echo Processus trouve sur le port 8080: %%a
    echo Arret du processus...
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo 2. Attente de liberation du port...
timeout /t 3 /nobreak >nul

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
echo 4. Demarrage du backend en mode permanent...
echo Le backend demarrera et restera actif
echo Pour arreter: Fermez cette fenetre ou Ctrl+C
echo ========================================
cd /d "%~dp0"
mvn spring-boot:run

echo.
echo Backend arrete
pause
