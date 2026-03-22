@echo off
echo Démarrage du backend FixyHome...

echo Vérification du port 8080...
netstat -ano | findstr :8080
if %errorlevel% equ 0 (
    echo Le port 8080 est déjà utilisé. Arrêt des processus...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080') do (
        echo Arrêt du processus PID: %%a
        taskkill /F /PID %%a
    )
    timeout /t 2 /nobreak >nul
)

echo Démarrage de Spring Boot...
mvn spring-boot:run

pause
