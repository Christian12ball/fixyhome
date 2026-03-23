# FixyHome - Configuration Railway

## 🚀 Structure du projet pour déploiement Railway

```
fixyhome/
├── frontend/          # Application Next.js
├── backend/           # Application Spring Boot
├── railway.json       # Configuration Railway
├── docker-compose.yml # Configuration locale
└── README.md         # Documentation
```

## 📋 Prérequis

- Compte Railway (https://railway.app)
- Git repository avec le code
- Variables d'environnement configurées

## 🔧 Configuration Railway

### 1. Variables d'environnement

#### Backend (Spring Boot)
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/fixyhome
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/fixyhome
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=password
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_PROFILES_ACTIVE=prod
JWT_SECRET=your-super-secret-jwt-key-here
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.railway.app
```

#### Frontend (Next.js)
```
NEXT_PUBLIC_API_URL=https://your-backend-domain.railway.app
NEXT_PUBLIC_APP_URL=https://your-frontend-domain.railway.app
NODE_ENV=production
```

### 2. Fichiers de configuration

#### railway.json
```json
{
  "build": {
    "builder": "NIXPACKS"
  }
}
```

#### backend/Dockerfile
```dockerfile
FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/*.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
```

#### frontend/Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## 🚀 Déploiement

### 1. Préparation du repository
```bash
git add .
git commit -m "Configure for Railway deployment"
git push origin main
```

### 2. Création des projets Railway

#### Backend
1. Nouveau projet Railway
2. Lier le repository Git
3. Choisir le dossier `backend`
4. Configurer les variables d'environnement
5. Déployer

#### Frontend
1. Nouveau projet Railway
2. Lier le repository Git  
3. Choisir le dossier `frontend`
4. Configurer les variables d'environnement
5. Déployer

### 3. Configuration des domaines
- Backend: `fixyhome-backend.railway.app`
- Frontend: `fixyhome-frontend.railway.app`

## 🔧 Tests de déploiement

### 1. Test backend
```bash
curl https://fixyhome-backend.railway.app/api/users/authenticate
```

### 2. Test frontend
- Visiter `https://fixyhome-frontend.railway.app`
- Tester la connexion avec les comptes de démo

## 📊 Monitoring

### Logs Railway
- Dashboard Railway → Logs
- Vérifier les erreurs de démarrage
- Surveiller les performances

### Base de données
- Railway → Database
- Vérifier la connexion
- Monitorer les requêtes

## 🛠️ Dépannage

### Problèmes courants
1. **Port 8080 non exposé**: Vérifier le Dockerfile du backend
2. **CORS**: Configurer les origines autorisées
3. **Variables d'environnement**: Vérifier toutes les clés
4. **Build échoue**: Vérifier les dépendances

### Solutions rapides
```bash
# Redéployer après modification
git add .
git commit -m "Fix deployment issue"
git push origin main

# Railway redéploie automatiquement
```

## 🎯 Résultat attendu

Après déploiement:
- ✅ Backend accessible sur Railway
- ✅ Frontend accessible sur Railway  
- ✅ Connexion fonctionnelle
- ✅ Base de données PostgreSQL connectée
- ✅ API endpoints opérationnels
