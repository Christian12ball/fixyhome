# Script pour tester avec un nouveau token
Write-Host "Test avec nouveau token incluant les authorities" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Forcer une nouvelle connexion
Write-Host "1. Nouvelle connexion admin..." -ForegroundColor Yellow
try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"admin@fixyhome.com","password":"admin123"}'
    $token = $loginResponse.token
    Write-Host "✅ Connexion réussie" -ForegroundColor Green
    Write-Host "Nouveau token: $($token.Substring(0, 50))..." -ForegroundColor Gray
    
    # Décoder le nouveau token
    $parts = $token.Split('.')
    $payload = $parts[1]
    while ($payload.Length % 4 -ne 0) {
        $payload += "="
    }
    $decodedBytes = [System.Convert]::FromBase64String($payload)
    $decodedText = [System.Text.Encoding]::UTF8.GetString($decodedBytes)
    Write-Host "Payload du nouveau token:" -ForegroundColor Yellow
    Write-Host $decodedText -ForegroundColor Gray
    
} catch {
    Write-Host "❌ Erreur de connexion: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Headers pour les requêtes admin
$headers = @{
    'Authorization' = "Bearer $token"
    'Content-Type' = 'application/json'
}

# Test endpoint users-admin
Write-Host ""
Write-Host "2. Test endpoint /api/admin/users-admin avec nouveau token..." -ForegroundColor Yellow
try {
    $usersResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/users-admin" -Headers $headers
    Write-Host "✅ Endpoint users-admin fonctionne!" -ForegroundColor Green
    Write-Host "Nombre d'utilisateurs: $($usersResponse.Count)" -ForegroundColor Gray
    
    # Afficher le premier utilisateur
    if ($usersResponse.Count -gt 0) {
        $firstUser = $usersResponse[0]
        Write-Host "Premier utilisateur:" -ForegroundColor Gray
        Write-Host "  ID: $($firstUser.id)" -ForegroundColor Gray
        Write-Host "  Email: $($firstUser.email)" -ForegroundColor Gray
        Write-Host "  Nom: $($firstUser.firstName) $($firstUser.lastName)" -ForegroundColor Gray
        Write-Host "  Type: $($firstUser.userType)" -ForegroundColor Gray
        Write-Host "  Actif: $($firstUser.isActive)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Erreur endpoint users-admin: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Test terminé" -ForegroundColor Cyan
Read-Host "Appuyez sur Entrée pour quitter"
