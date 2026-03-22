# FixyHome

FixyHome est une application dédiée à la mise en relation entre les particuliers et les prestataires de services dans un contexte où il est souvent difficile de trouver facilement un artisan fiable ou même un électricien qualifié.

Elle vise à faciliter le quotidien tout en renforçant la confiance grâce à un système de recommandation et de trouver une aide qualifiée en permanence, en proposant une solution moderne, pratique et sécurisée.

## Stack Technique

- **Frontend**: Next.js 16 avec TypeScript et TailwindCSS
- **Backend**: Spring Boot (à configurer)
- **Base de données**: PostgreSQL (à configurer)
- **Authentification**: JWT
- **Déploiement**: Vercel (frontend) + Docker (backend)

## Fonctionnalités

### Pour les clients
- Recherche d'artisans par catégorie (plomberie, électricité, ménage)
- Géolocalisation pour trouver les artisans à proximité
- Système de devis et de réservation
- Avis et notation des artisans
- Paiement sécurisé

### Pour les artisans
- Création de profil professionnel
- Gestion des disponibilités
- Réception des demandes de service
- Facturation et suivi des paiements
- Gestion des avis clients

## Zone d'intervention

Le Havre et alentours (France)

## Installation

### Prérequis
- Node.js 18+ 
- PostgreSQL 14+
- Java 17+ (pour le backend Spring Boot)

### Frontend (Next.js)

1. Cloner le repository
```bash
git clone <repository-url>
cd fixyhome
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
```bash
cp env.example .env.local
# Éditer .env.local avec vos configurations
```

4. Démarrer le serveur de développement
```bash
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

### Backend (Spring Boot)

1. Créer un projet Spring Boot avec les dépendances suivantes :
   - Spring Web
   - Spring Data JPA
   - Spring Security
   - PostgreSQL Driver
   - Spring Boot DevTools
   - Validation

2. Configurer la base de données PostgreSQL
3. Implémenter les endpoints API (voir `src/lib/api.ts` pour la structure attendue)

## Structure du Projet

```
src/
├── app/                    # Pages Next.js
│   ├── page.tsx           # Page d'accueil
│   ├── login/             # Page de connexion
│   ├── register/          # Page d'inscription
│   ├── services/          # Page des services
│   └── layout.tsx         # Layout principal
├── lib/
│   └── api.ts             # Configuration API pour Spring Boot
└── components/            # Composants réutilisables
```

## API Endpoints

L'application frontend s'attend à ce que le backend Spring Boot expose les endpoints suivants :

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `POST /api/auth/logout` - Déconnexion

### Services
- `GET /api/services/requests` - Lister les demandes de service
- `POST /api/services/requests` - Créer une demande de service
- `PUT /api/services/requests/{id}` - Mettre à jour une demande

### Artisans
- `GET /api/artisans` - Lister les artisans
- `GET /api/artisans/{id}` - Détails d'un artisan
- `GET /api/artisans/{id}/reviews` - Avis d'un artisan

### Utilisateurs
- `GET /api/users/profile` - Profil utilisateur
- `PUT /api/users/profile` - Mettre à jour le profil

## Déploiement

### Frontend (Vercel)
1. Connecter le repository à Vercel
2. Configurer les variables d'environnement
3. Déployer automatiquement

### Backend (Docker)
1. Créer un Dockerfile pour l'application Spring Boot
2. Builder et déployer sur votre serveur préféré

## Contribuer

1. Fork le projet
2. Créer une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -am 'Ajout d'une nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

## Licence

Ce projet est sous licence MIT.
