# Script pour tester les endpoints de l'API FixyHome
# Exécutez ces commandes une par une pour vérifier que tout fonctionne

# Test 1: Vérifier que le backend est en ligne
echo "=== Test 1: Vérification du backend ==="
curl -s http://localhost:8080/api/services/public/categories || echo "Backend non accessible"

# Test 2: Récupérer toutes les catégories publiques
echo -e "\n=== Test 2: Récupération des catégories publiques ==="
curl -s -H "Content-Type: application/json" http://localhost:8080/api/services/public/categories | jq '.' || echo "Erreur de formatage JSON"

# Test 3: Récupérer tous les services publics
echo -e "\n=== Test 3: Récupération des services publics ==="
curl -s -H "Content-Type: application/json" http://localhost:8080/api/services/public | jq '.' || echo "Erreur de formatage JSON"

# Test 4: Récupérer les services par catégorie (plomberie)
echo -e "\n=== Test 4: Services par catégorie (plomberie) ==="
curl -s -H "Content-Type: application/json" http://localhost:8080/api/services/public/category/1 | jq '.' || echo "Erreur de formatage JSON"

echo -e "\n=== Tests terminés ==="
