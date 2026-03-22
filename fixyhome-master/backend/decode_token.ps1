# Script pour décoder le token JWT
$token = "eyJhbGciOiJIUzUxMiJ9.eyJ1c2VyVHlwZSI6IkFETUlOIiwic3ViIjoiYWRtaW5AdGVzdC5jb20iLCJpYXQiOjE3NzAxMTI0MjEsImV4cCI6MTc3MDE5ODgyMX0.nyMyR4jhb0zeIP3DV4x1v8yHhGVQcWAXxZsniasU3kF7h_zfZ9m5UsyVNXI16ZLtpRnjiGB4BgRFeyfTfBNVSg"

$parts = $token.Split('.')
$payload = $parts[1]

# Ajouter le padding si nécessaire
while ($payload.Length % 4 -ne 0) {
    $payload += "="
}

$decodedBytes = [System.Convert]::FromBase64String($payload)
$decodedText = [System.Text.Encoding]::UTF8.GetString($decodedBytes)

Write-Host "Payload du token JWT:"
Write-Host $decodedText

# Convertir en JSON pour une meilleure lisibilité
$jsonObject = $decodedText | ConvertFrom-Json
$jsonObject | ConvertTo-Json -Depth 10
