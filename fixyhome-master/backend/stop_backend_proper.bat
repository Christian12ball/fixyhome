@echo off
echo ========================================
echo Arret propre du backend FixyHome
echo ========================================
echo.

echo 1. Recherche des processus sur le port 8080...
netstat -ano | findstr :8080

echo.
echo 2. Arret des processus Java sur le port 8080...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080') do (
    echo Arret du processus %%a...
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo 3. Verification que le port est libre...
netstat -ano | findstr :8080
if %errorlevel% equ 0 (
    echo ATTENTION: Des processus sont encore actifs sur le port 8080
) else (
    echo Port 8080 confirme libre
)

echo.
echo 4. Arret des processus Java restants...
taskkill /F /IM java.exe >nul 2>&1

echo.
echo ========================================
echo Backend arrete avec succes
echo ========================================
pause
