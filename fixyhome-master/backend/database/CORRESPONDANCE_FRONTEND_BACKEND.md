# 📊 Tableau de Correspondance Frontend ↔ Backend ↔ Base de Données

## 🎯 Vue d'ensemble

Ce document détaille la correspondance complète entre les fichiers frontend, les endpoints backend et les tables de la base de données PostgreSQL.

---

## 📱 **Pages Frontend et leurs Endpoints Backend**

### 1. **Page Directory** (`/src/app/directory/page.tsx`)
**Appels API :**
- `GET /api/users/profiles/artisans` → `UserController.getArtisanProfiles()`
- `GET /api/users/profiles` → `UserController.getAllProfiles()` (fallback)
- `POST /api/notifications/send` → Envoi de notifications

**Backend correspondant :**
- `UserController.java` - Méthodes `getArtisanProfiles()` et `getAllProfiles()`
- `UserService.java` - Logique métier pour les profils

**Base de données :**
- `users` - Informations utilisateur
- `artisans` - Profils artisans détaillés

---

### 2. **Page Services** (`/src/app/services/page.tsx`)
**Appels API :**
- `GET /api/services/all` → Services pour admin
- `GET /api/services/public` → Services publics
- `POST /api/service-categories` → Ajout catégorie (admin)

**Backend correspondant :**
- `AdminController.java` - Gestion des services admin
- `ServiceTypeController.java` - Types de services
- `ServiceCategoryController.java` - Catégories

**Base de données :**
- `service_categories` - Catégories principales
- `service_types` - Types de services spécifiques

---

### 3. **Page Artisan Profile** (`/src/app/artisan-profile/[id]/page.tsx`)
**Appels API :**
- `GET /api/services/artisan/{id}` → Détails artisan
- `POST /api/service-requests` → Création demande
- `POST /api/interventions` → Création intervention

**Backend correspondant :**
- `ArtisanController.java` - Profils artisans
- `ServiceRequestController.java` - Demandes de service
- `InterventionController.java` - Interventions

**Base de données :**
- `artisans` - Profils artisans
- `service_requests` - Demandes de service
- `interventions` - Interventions planifiées

---

### 4. **Page Dashboard Client** (`/src/app/dashboard/page.tsx`)
**Appels API :**
- `GET /api/users/profile` → Profil utilisateur
- `GET /api/service-requests/client` → Demandes client
- `GET /api/interventions/client` → Interventions client

**Backend correspondant :**
- `UserController.java` - Gestion profils
- `ServiceRequestController.java` - Demandes
- `InterventionController.java` - Interventions

**Base de données :**
- `users` - Informations client
- `service_requests` - Historique demandes
- `interventions` - Historique interventions

---

### 5. **Page Dashboard Artisan** (`/src/app/dashboard/artisan/page.tsx`)
**Appels API :**
- `GET /api/users/profile` → Profil artisan
- `GET /api/service-requests/artisan` → Demandes reçues
- `GET /api/interventions/artisan` → Interventions

**Backend correspondant :**
- `UserController.java` - Profils
- `ServiceRequestController.java` - Demandes
- `InterventionController.java` - Interventions

**Base de données :**
- `artisans` - Profil artisan
- `service_requests` - Demandes assignées
- `interventions` - Réalisations

---

### 6. **Page Admin Dashboard** (`/src/app/admin/dashboard/page.tsx`)
**Appels API :**
- `GET /api/admin/dashboard/stats` → Statistiques
- `GET /api/admin/users` → Utilisateurs
- `GET /api/admin/artisans` → Artisans
- `GET /api/admin/service-requests` → Demandes

**Backend correspondant :**
- `AdminController.java` - Administration complète
- Tous les autres controllers pour la gestion

**Base de données :**
- Toutes les tables (accès admin complet)

---

## 🔗 **Mapping Complet des Tables**

### 📋 **Table `users`**
**Frontend :** AuthContext.tsx, ProfileContext.tsx, tous les profils
**Backend :** UserController.java, AuthController.java
**Champs :**
- `id`, `email`, `first_name`, `last_name`, `phone`
- `password`, `user_type`, `is_active`
- `created_at`, `updated_at`

---

### 👨‍🔧 **Table `artisans`**
**Frontend :** Pages directory, artisan-profile, dashboard artisan
**Backend :** ArtisanController.java, AdminController.java
**Champs :**
- `id`, `user_id` (FK vers users)
- `category`, `description`, `experience`
- `rating`, `review_count`, `is_verified`
- `hourly_rate`, `location`, `availability`

---

### 🏷️ **Table `service_categories`**
**Frontend :** Page services, filtres de recherche
**Backend :** ServiceCategoryController.java
**Champs :**
- `id`, `label`, `description`, `icon_url`
- `is_active`, `created_at`, `updated_at`

---

### 🔧 **Table `service_types`**
**Frontend :** Page services, détails services
**Backend :** ServiceTypeController.java
**Champs :**
- `id`, `label`, `description`, `icon_url`
- `category_id` (FK), `is_active`

---

### 📝 **Table `service_requests`**
**Frontend :** Dashboard client/artisan, page artisan-profile
**Backend :** ServiceRequestController.java
**Champs :**
- `id`, `title`, `description`, `category_id`
- `service_type_id`, `status`, `client_id`
- `artisan_id`, `location`, `budget`

---

### 🛠️ **Table `interventions`**
**Frontend :** Dashboards, page artisan-profile
**Backend :** InterventionController.java
**Champs :**
- `id`, `service_request_id` (FK)
- `artisan_id`, `client_id`, `title`
- `status`, `scheduled_date`, `duration_hours`
- `actual_cost`, `notes`

---

### 💰 **Table `payments`**
**Frontend :** Page payments, dashboards
**Backend :** PaymentController.java
**Champs :**
- `id`, `intervention_id` (FK), `client_id`
- `amount`, `status`, `payment_method`
- `transaction_id`, `payment_date`

---

### ⭐ **Table `reviews`**
**Frontend :** Page artisan-profile, dashboards
**Backend :** ReviewController.java
**Champs :**
- `id`, `rating`, `comment`, `client_id`
- `artisan_id`, `service_request_id`
- `intervention_id`, `created_at`

---

### 🔔 **Table `notifications`**
**Frontend :** Système de notifications global
**Backend :** NotificationController.java
**Champs :**
- `id`, `user_id`, `title`, `message`
- `type`, `is_read`, `related_id`
- `created_at`

---

### 📞 **Table `contacts`**
**Frontend :** Page contact, directory
**Backend :** ContactController.java
**Champs :**
- `id`, `name`, `email`, `phone`
- `subject`, `message`, `user_id`
- `artisan_id`, `contact_method`, `status`

---

## 🔄 **Flux de Données Complet**

### 1. **Inscription Client**
```
Frontend (register) → AuthController.register() → UserService.registerUser() 
→ Table users → Email de confirmation
```

### 2. **Inscription Artisan**
```
Frontend (register/pro) → AuthController.register() → UserService.registerUser() 
→ Table users + Table artisans → Email de validation
```

### 3. **Connexion**
```
Frontend (login) → AuthController.login() → JwtUtil.generateToken() 
→ Token JWT stocké → AuthContext mis à jour
```

### 4. **Création Demande Service**
```
Frontend (artisan-profile) → ServiceRequestController.create() 
→ Table service_requests → Notification artisan → Email
```

### 5. **Acceptation Intervention**
```
Frontend (dashboard/artisan) → InterventionController.create() 
→ Table interventions → Table service_requests (status update) 
→ Notification client
```

### 6. **Paiement**
```
Frontend (payment) → PaymentController.process() → Table payments 
→ Table interventions (completed) → Notification both parties
```

---

## 🌍 **Configuration UTF-8**

### Frontend
- **layout.tsx** : `charset: "utf-8"` dans metadata
- **globals.css** : `@charset "UTF-8"`
- **Langue** : `<html lang="fr">`

### Backend
- **application.properties** : `useUnicode=true&characterEncoding=UTF-8`
- **Database URL** : Paramètres UTF-8 ajoutés
- **Hibernate** : Support natif UTF-8

### Base de Données
- **Création** : `CREATE DATABASE fixyhome WITH ENCODING 'UTF8'`
- **Session** : `SET client_encoding = 'UTF8'`
- **Strings** : `SET standard_conforming_strings = on`

---

## ✅ **Validation de la Complétude**

### Frontend ✅
- [x] Directory → Profiles artisans
- [x] Services → Catégories et types
- [x] Artisan Profile → Détails complets
- [x] Dashboard Client → Historique
- [x] Dashboard Artisan → Gestion
- [x] Admin Dashboard → Administration

### Backend ✅
- [x] UserController → Authentification et profils
- [x] ArtisanController → Gestion artisans
- [x] ServiceRequestController → Demandes
- [x] InterventionController → Interventions
- [x] AdminController → Administration
- [x] AuthController → Sécurité

### Base de Données ✅
- [x] Toutes les tables créées
- [x] Relations correctes
- [x] Index optimisés
- [x] Triggers automatiques
- [x] Vues utilitaires

### UTF-8 ✅
- [x] Frontend configuré
- [x] Backend configuré
- [x] Base de données configurée
- [x] Support complet des accents

---

## 🚀 **Déploiement**

### 1. Base de Données
```bash
# Création avec UTF-8
CREATE DATABASE fixyhome WITH ENCODING 'UTF8';

# Exécution des scripts
psql -U postgres -d fixyhome -f fixyhome_database_complete.sql
psql -U postgres -d fixyhome -f fixyhome_sample_data.sql
```

### 2. Backend
```bash
# Démarrage avec configuration UTF-8
./mvnw spring-boot:run
```

### 3. Frontend
```bash
# Démarrage avec support UTF-8
npm run dev
```

---

**Conclusion :** Le système est complètement intégré avec un support UTF-8 de bout en bout, du frontend à la base de données PostgreSQL.
