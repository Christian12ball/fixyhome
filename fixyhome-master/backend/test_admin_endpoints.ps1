# Script pour tester les endpoints admin corrigés
Write-Host "Test des endpoints admin corrigés" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# Test de connexion pour obtenir un token
Write-Host "1. Test de connexion admin..." -ForegroundColor Yellow
try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"admin@test.com","password":"admin123"}'
    $token = $loginResponse.token
    Write-Host "✅ Connexion réussie" -ForegroundColor Green
    Write-Host "Token: $($token.Substring(0, 50))..." -ForegroundColor Gray
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
Write-Host "2. Test endpoint /api/admin/users-admin..." -ForegroundColor Yellow
try {
    $usersResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/users-admin" -Headers $headers
    Write-Host "✅ Endpoint users-admin fonctionne" -ForegroundColor Green
    Write-Host "Nombre d'utilisateurs: $($usersResponse.Count)" -ForegroundColor Gray
    
    # Afficher le premier utilisateur pour vérifier la structure
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

# Test endpoint artisans-admin
Write-Host ""
Write-Host "3. Test endpoint /api/admin/artisans-admin..." -ForegroundColor Yellow
try {
    $artisansResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/artisans-admin" -Headers $headers
    Write-Host "✅ Endpoint artisans-admin fonctionne" -ForegroundColor Green
    Write-Host "Nombre d'artisans: $($artisansResponse.Count)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Erreur endpoint artisans-admin: $($_.Exception.Message)" -ForegroundColor Red
}

# Test endpoint service-requests-admin
Write-Host ""
Write-Host "4. Test endpoint /api/admin/service-requests-admin..." -ForegroundColor Yellow
try {
    $requestsResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/service-requests-admin" -Headers $headers
    Write-Host "✅ Endpoint service-requests-admin fonctionne" -ForegroundColor Green
    Write-Host "Nombre de demandes: $($requestsResponse.Count)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Erreur endpoint service-requests-admin: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Tests terminés" -ForegroundColor Cyan
Read-Host "Appuyez sur Entrée pour quitter"
