# FixyHome Backend

Backend Spring Boot pour l'application FixyHome avec PostgreSQL.

## Prérequis

- Java 17+
- Maven 3.6+
- PostgreSQL 14+

## Installation

### 1. Configuration de la base de données PostgreSQL

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE fixyhome;

# Créer l'utilisateur
CREATE USER fixyhome_user WITH PASSWORD 'fixyhome_password';

# Donner les droits
GRANT ALL PRIVILEGES ON DATABASE fixyhome TO fixyhome_user;

# Quitter
\q
```

### 2. Importer le schéma

```bash
psql -U fixyhome_user -d fixyhome -f backend/database/schema.sql
```

### 3. Compiler et démarrer l'application

```bash
# Aller dans le répertoire backend
cd backend

# Compiler avec Maven
mvn clean compile

# Démarrer l'application
mvn spring-boot:run
```

L'API sera disponible sur `http://localhost:8080/api`

## Configuration

Le fichier `application.properties` contient la configuration :

- **Port serveur** : 8080
- **Context path** : /api
- **Base de données** : PostgreSQL sur localhost:5432
- **JWT** : Clé secrète et expiration (24h)
- **CORS** : Autorisé pour http://localhost:3000

## Endpoints API

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `POST /api/auth/logout` - Déconnexion

### Utilisateurs
- `GET /api/users/profile` - Profil utilisateur (authentifié)
- `PUT /api/users/profile` - Mettre à jour le profil (authentifié)

### Services
- `GET /api/services/requests` - Lister les demandes (authentifié)
- `POST /api/services/requests` - Créer une demande (client)
- `PUT /api/services/requests/{id}` - Mettre à jour une demande (authentifié)
- `GET /api/services/requests/{id}` - Détails d'une demande (authentifié)
- `GET /api/services/pending` - Demandes en attente (public)

### Artisans
- `GET /api/artisans` - Lister les artisans (public)
- `GET /api/artisans/{id}` - Détails d'un artisan (public)
- `GET /api/artisans/{id}/reviews` - Avis d'un artisan (public)

### Avis
- `POST /api/reviews` - Créer un avis (client)

## Données de test

Le schéma inclut des données de test :

### Utilisateurs
- **Email** : `test@fixyhome.com`
- **Mot de passe** : `password`
- **Type** : CLIENT

### Artisans de test
- Pierre Durand - Plombier (artisan1@example.com)
- Sophie Lefebvre - Électricienne (artisan2@example.com)

## Sécurité

- **JWT** : Tokens valables 24h
- **Spring Security** : Configuration avec rôles CLIENT/ARTISAN
- **CORS** : Configuré pour le frontend sur localhost:3000
- **Validation** : Validation des entrées avec Bean Validation

## Développement

### Structure du projet

```
src/main/java/com/fixyhome/
├── controller/     # Contrôleurs REST
├── service/        # Services métier
├── repository/     # Repositories Spring Data
├── model/          # Entités JPA
├── security/       # Configuration sécurité
└── dto/           # Data Transfer Objects
```

### Logs

Les logs sont configurés en mode DEBUG pour le développement.

### Hot Reload

Spring Boot DevTools est inclus pour le rechargement automatique.

## Déploiement

### Docker

```bash
# Builder l'image
mvn clean package
docker build -t fixyhome-backend .

# Démarrer le conteneur
docker run -p 8080:8080 fixyhome-backend
```

### Production

Pour la production, modifier :
- La clé secrète JWT
- Les identifiants base de données
- Désactiver les logs DEBUG
- Configurer HTTPS
