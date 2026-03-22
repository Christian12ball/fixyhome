@echo off
echo Démarrage du backend FixyHome sur le port 8081...

echo Utilisation du profil alternatif pour éviter les conflits de port...
mvn spring-boot:run -Dspring-boot.run.profiles=alt

pause
