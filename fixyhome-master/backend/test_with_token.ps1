# Test avec token
Write-Host "Test avec token" -ForegroundColor Cyan

# Obtenir un token
try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"admin@test.com","password":"admin123"}'
    $token = $loginResponse.token
    Write-Host "Token obtenu" -ForegroundColor Green
    
    $headers = @{
        'Authorization' = "Bearer $token"
        'Content-Type' = 'application/json'
    }
    
    Write-Host "Test avec Authorization header..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/users-admin" -Headers $headers
    Write-Host "✅ Succès!" -ForegroundColor Green
    Write-Host "Nombre d'utilisateurs: $($response.Count)" -ForegroundColor Gray
    
} catch {
    Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
    }
}
