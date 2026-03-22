# Guide de démarrage du backend FixyHome

## 🚀 **Scripts de démarrage automatique**

Pour éviter les problèmes de port 8080 déjà utilisé, j'ai créé plusieurs scripts pour vous aider.

### 📁 **Scripts disponibles**

#### **1. Scripts Batch (.bat) - Windows**
- `stop_backend.bat` - Arrête tous les processus sur le port 8080
- `start_backend.bat` - Vérifie et arrête les processus, puis démarre le backend
- `start_backend_alt.bat` - Démarre le backend sur le port 8081 (alternative)
- `start_backend_clean.bat` - **NOUVEAU** : Script complet pour démarrer proprement

#### **2. Scripts PowerShell (.ps1) - Windows**
- `stop_backend.ps1` - Arrête les processus sur le port 8080 (PowerShell)
- `start_backend.ps1` - Vérifie et démarre le backend (PowerShell)
- `kill_port_8080.ps1` - **NOUVEAU** : Script pour arrêter les processus sur le port 8080
- `start_backend_clean.ps1` - **NOUVEAU** : Script PowerShell pour démarrer proprement

#### **3. Configuration alternative**
- `application-alt.properties` - Configuration pour le port 8081

## 🎯 **Utilisation recommandée**

### **Option 1 : Script Batch (le plus simple)**
```bash
# Double-cliquez sur ce fichier ou exécutez dans le terminal :
start_backend.bat
```

### **Option 2 : Script PowerShell (plus robuste)**
```bash
# Dans PowerShell :
.\start_backend_clean.ps1
```

### **Option 3 : Script PowerShell (nouveau)**
```bash
# Dans PowerShell :
powershell -ExecutionPolicy Bypass -File start_backend_clean.ps1
```

## 🔧 **Scripts de démarrage propre (NOUVEAUX)**

### **start_backend_clean.bat**
- ✅ Vérifie si le port 8080 est utilisé
- ✅ Arrête automatiquement les processus sur le port 8080
- ✅ Attend que le port se libère
- ✅ Vérifie que le port est bien libre
- ✅ Démarre le backend dans une nouvelle fenêtre

### **start_backend_clean.ps1**
- ✅ Mêmes fonctionnalités que la version batch
- ✅ Affiche des messages colorés pour le suivi
- ✅ Démarrage en arrière-plan
- ✅ Instructions pour arrêter le backend

### **kill_port_8080.ps1**
- ✅ Script spécialisé pour arrêter les processus sur le port 8080
- ✅ Affiche les détails des processus arrêtés
- ✅ Gère les erreurs proprement

## 🛠️ **Dépannage - Problèmes courants**

### **❌ "Port 8080 was already in use"**

**Solution 1 : Utiliser les scripts automatiques**
```bash
# Option A : Script Batch
start_backend_clean.bat

# Option B : Script PowerShell
powershell -ExecutionPolicy Bypass -File start_backend_clean.ps1
```

**Solution 2 : Manuellement**
```powershell
# 1. Trouver les processus sur le port 8080
netstat -ano | findstr :8080

# 2. Arrêter le processus (remplacer PID par le numéro trouvé)
taskkill /F /PID PID

# 3. Démarrer le backend
mvn spring-boot:run
```

**Solution 3 : Utiliser un autre port**
```bash
# Utiliser le port 8081
start_backend_alt.bat
```

### **❌ "BUILD SUCCESS mais le backend ne démarre pas"**

**Cause** : Le backend démarre en arrière-plan mais ne reste pas actif.

**Solution** :
```powershell
# Vérifier si le processus Java est actif
Get-Process java | Select-Object Name, Id

# S'il n'est pas actif, utiliser le script de démarrage propre
start_backend_clean.ps1
```

### **❌ "Le backend s'arrête immédiatement après le démarrage"**

**Cause** : Erreur de compilation ou problème de base de données.

**Solution** :
```bash
# 1. Vérifier les logs de compilation
mvn clean compile

# 2. Vérifier la connexion à la base de données
# Le backend doit pouvoir se connecter à PostgreSQL

# 3. Utiliser le script de démarrage propre qui affiche les erreurs
start_backend_clean.ps1
```

## 📋 **Résumé des scripts créés**

| Script | Type | Fonction | Recommandation |
|--------|------|----------|----------------|
| `start_backend_clean.bat` | Batch | Démarrage propre complet | **Le plus simple** |
| `start_backend_clean.ps1` | PowerShell | Démarrage propre avec logs | **Le plus robuste** |
| `kill_port_8080.ps1` | PowerShell | Arrêter processus port 8080 | Maintenance |
| `start_backend.bat` | Batch | Démarrage de base | Alternative |
| `start_backend_alt.bat` | Batch | Démarrage port 8081 | Si 8080 bloqué |

## 🎯 **Recommandation finale**

Pour éviter tous les problèmes de port 8080, utilisez systématiquement :

```bash
# Le meilleur choix pour un démarrage fiable
start_backend_clean.ps1
```

Ce script :
- ✅ Gère automatiquement les conflits de port
- ✅ Vérifie que le port est bien libre
- ✅ Affiche des messages clairs
- ✅ Démarre le backend proprement
- ✅ Donne des instructions pour l'arrêter

## 🔧 **Manuel (si les scripts ne fonctionnent pas)**

### **Étape 1 : Arrêter les processus sur le port 8080**
```bash
# Trouver les processus
netstat -ano | findstr :8080

# Arrêter les processus (remplacer PID par le numéro trouvé)
taskkill /F /PID <PID>
```

### **Étape 2 : Démarrer le backend**
```bash
mvn clean spring-boot:run
```

### **Étape 3 : Port alternatif**
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=alt
```

## 🛠️ **Configuration des ports**

### **Port 8080 (par défaut)**
- Backend : `http://localhost:8080/api`
- Frontend : `http://localhost:3000`

### **Port 8081 (alternative)**
- Backend : `http://localhost:8081/api`
- Frontend : `http://localhost:3000`

> **Note** : Si vous utilisez le port 8081, vous devrez mettre à jour les URLs dans le frontend.

## 📋 **Dépannage**

### **Problème : "Port 8080 was already in use"**
**Solution** : Utilisez `start_backend.bat` ou `start_backend.ps1`

### **Problème : Scripts PowerShell bloqués**
**Solution** : Exécutez cette commande dans PowerShell (en tant qu'administrateur) :
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### **Problème : Le backend ne démarre pas**
**Solutions** :
1. Vérifiez que PostgreSQL est démarré
2. Vérifiez que la base de données `fixyhome` existe
3. Nettoyez avec `mvn clean` avant de redémarrer

### **Problème : CORS après changement de port**
**Solution** : Mettez à jour la configuration CORS dans `application.properties`

## 🔄 **Workflow recommandé**

1. **Arrêter les processus existants** :
   ```bash
   start_backend.bat  # ou stop_backend.bat
   ```

2. **Attendre que le backend démarre** :
   - Recherchez `Started FixyHomeApplication` dans les logs
   - Vérifiez `Tomcat started on port 8080`

3. **Vérifier l'accès** :
   ```bash
   curl http://localhost:8080/api/auth/login
   ```

4. **Démarrer le frontend** :
   ```bash
   cd ../frontend
   npm run dev
   ```

## 📊 **Vérification du bon fonctionnement**

### **Backend démarré avec succès**
```
Tomcat started on port 8080 (http) with context path '/api'
Started FixyHomeApplication in XX.XXX seconds
```

### **Port disponible**
```bash
netstat -ano | findstr :8080
# Devrait afficher : TCP 0.0.0.0:8080 LISTENING <PID>
```

### **Test de l'API**
```bash
# Test endpoint (doit retourner 403 Forbidden, c'est normal)
curl http://localhost:8080/api/auth/login
```

## 🎯 **Conclusion**

Avec ces scripts, vous ne devriez plus avoir de problèmes de port 8080. Utilisez :
- `start_backend.bat` pour un démarrage automatique
- `start_backend_alt.bat` si le port 8081 est préféré
- Les scripts manuels si nécessaire

Le backend démarrera correctement et vous pourrez vous connecter à tous les types de comptes (admin, client, artisan).
