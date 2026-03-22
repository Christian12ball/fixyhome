# Script de test pour l'authentification FixyHome
# Ce script teste la création d'un admin et l'authentification

Write-Host "=== Test d'authentification FixyHome ===" -ForegroundColor Green

# Test 1: Créer un administrateur
Write-Host "`n1. Création d'un administrateur..." -ForegroundColor Yellow
try {
    $createAdminResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/create-admin" -Method POST -ContentType "application/json" -ErrorAction Stop
    Write-Host "✅ Administrateur créé avec succès" -ForegroundColor Green
    Write-Host "Email: $($createAdminResponse.email)" -ForegroundColor Cyan
    Write-Host "Mot de passe: $($createAdminResponse.password)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Erreur lors de la création de l'admin: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorBody = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorBody)
        $errorText = $reader.ReadToEnd()
        Write-Host "Détails: $errorText" -ForegroundColor Red
    }
}

# Test 2: Connexion avec l'administrateur
Write-Host "`n2. Test de connexion avec l'administrateur..." -ForegroundColor Yellow
try {
    $loginBody = @{
        email = "admin@fixyhome.com"
        password = "admin123"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody -ErrorAction Stop
    Write-Host "✅ Connexion réussie" -ForegroundColor Green
    Write-Host "Token: $($loginResponse.token.Substring(0, 50))..." -ForegroundColor Cyan
    Write-Host "Type: $($loginResponse.userType)" -ForegroundColor Cyan
    Write-Host "Nom: $($loginResponse.firstName) $($loginResponse.lastName)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Erreur de connexion: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorBody = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorBody)
        $errorText = $reader.ReadToEnd()
        Write-Host "Détails: $errorText" -ForegroundColor Red
    }
}

# Test 3: Connexion avec un client existant
Write-Host "`n3. Test de connexion avec un client existant..." -ForegroundColor Yellow
try {
    $loginBody = @{
        email = "jean.client@fixyhome.com"
        password = "password123"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody -ErrorAction Stop
    Write-Host "✅ Connexion client réussie" -ForegroundColor Green
    Write-Host "Token: $($loginResponse.token.Substring(0, 50))..." -ForegroundColor Cyan
    Write-Host "Type: $($loginResponse.userType)" -ForegroundColor Cyan
    Write-Host "Nom: $($loginResponse.firstName) $($loginResponse.lastName)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Erreur de connexion client: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorBody = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorBody)
        $errorText = $reader.ReadToEnd()
        Write-Host "Détails: $errorText" -ForegroundColor Red
    }
}

Write-Host "`n=== Tests terminés ===" -ForegroundColor Green
