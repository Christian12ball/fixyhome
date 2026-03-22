-- ==========================================
-- BASE DE DONNÉES COMPLÈTE FIXYHOME
-- ==========================================
-- Création complète de la base de données pour le projet FixyHome
-- Basé sur l'analyse du frontend fixyhome-master
-- Encodage UTF-8 pour supporter les accents

-- Créer d'abord la base de données avec encodage UTF-8 :
-- CREATE DATABASE fixyhome WITH ENCODING 'UTF8';

-- Configuration de l'encodage pour la session
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

-- ==========================================
-- TYPES ENUM
-- ==========================================

DO $$ BEGIN
    CREATE TYPE user_type AS ENUM ('CLIENT', 'ARTISAN', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE service_category_type AS ENUM ('PLUMBING', 'ELECTRICITY', 'CLEANING', 'GARDENING', 'PAINTING', 'CARPENTRY', 'HVAC', 'ROOFING', 'MOVING', 'SECURITY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE service_request_status AS ENUM ('PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE intervention_status AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM ('SERVICE_REQUEST', 'INTERVENTION_UPDATE', 'PAYMENT', 'REVIEW', 'SYSTEM');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==========================================
-- TABLES PRINCIPALES
-- ==========================================

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type user_type NOT NULL DEFAULT 'CLIENT',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des profils artisans
CREATE TABLE IF NOT EXISTS artisans (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    category service_category_type NOT NULL,
    description TEXT,
    experience INTEGER NOT NULL DEFAULT 0,
    rating DECIMAL(3,2) NOT NULL DEFAULT 0.0,
    review_count INTEGER NOT NULL DEFAULT 0,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    hourly_rate INTEGER,
    availability TEXT, -- JSON ou texte pour les disponibilités
    location VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des catégories de services
CREATE TABLE IF NOT EXISTS service_categories (
    id BIGSERIAL PRIMARY KEY,
    label VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des types de services
CREATE TABLE IF NOT EXISTS service_types (
    id BIGSERIAL PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    category_id BIGINT REFERENCES service_categories(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des demandes de service
CREATE TABLE IF NOT EXISTS service_requests (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category_id BIGINT REFERENCES service_categories(id),
    service_type_id BIGINT REFERENCES service_types(id),
    status service_request_status NOT NULL DEFAULT 'PENDING',
    client_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    artisan_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    location VARCHAR(255) NOT NULL,
    budget INTEGER,
    urgency VARCHAR(50) DEFAULT 'NORMAL',
    preferred_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des interventions
CREATE TABLE IF NOT EXISTS interventions (
    id BIGSERIAL PRIMARY KEY,
    service_request_id BIGINT NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
    artisan_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    client_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status intervention_status NOT NULL DEFAULT 'SCHEDULED',
    scheduled_date TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    duration_hours INTEGER,
    actual_cost INTEGER,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des paiements
CREATE TABLE IF NOT EXISTS payments (
    id BIGSERIAL PRIMARY KEY,
    intervention_id BIGINT NOT NULL REFERENCES interventions(id) ON DELETE CASCADE,
    client_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    status payment_status NOT NULL DEFAULT 'PENDING',
    payment_method VARCHAR(100),
    transaction_id VARCHAR(255),
    payment_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des avis
CREATE TABLE IF NOT EXISTS reviews (
    id BIGSERIAL PRIMARY KEY,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    client_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    artisan_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_request_id BIGINT REFERENCES service_requests(id) ON DELETE SET NULL,
    intervention_id BIGINT REFERENCES interventions(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des notifications
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    related_id BIGINT, -- ID de l'entité liée (service_request, intervention, etc.)
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table des contacts (pour les demandes de contact depuis le frontend)
CREATE TABLE IF NOT EXISTS contacts (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    artisan_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    contact_method VARCHAR(50), -- EMAIL, PHONE, WHATSAPP
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table des sessions (pour la gestion des connexions)
CREATE TABLE IF NOT EXISTS user_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- INDEX POUR OPTIMISATION
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

CREATE INDEX IF NOT EXISTS idx_artisans_user_id ON artisans(user_id);
CREATE INDEX IF NOT EXISTS idx_artisans_category ON artisans(category);
CREATE INDEX IF NOT EXISTS idx_artisans_verified ON artisans(is_verified);
CREATE INDEX IF NOT EXISTS idx_artisans_rating ON artisans(rating);

CREATE INDEX IF NOT EXISTS idx_service_categories_active ON service_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_service_types_active ON service_types(is_active);
CREATE INDEX IF NOT EXISTS idx_service_types_category ON service_types(category_id);

CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);
CREATE INDEX IF NOT EXISTS idx_service_requests_client ON service_requests(client_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_artisan ON service_requests(artisan_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_category ON service_requests(category_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_created ON service_requests(created_at);

CREATE INDEX IF NOT EXISTS idx_interventions_request ON interventions(service_request_id);
CREATE INDEX IF NOT EXISTS idx_interventions_artisan ON interventions(artisan_id);
CREATE INDEX IF NOT EXISTS idx_interventions_client ON interventions(client_id);
CREATE INDEX IF NOT EXISTS idx_interventions_status ON interventions(status);
CREATE INDEX IF NOT EXISTS idx_interventions_date ON interventions(scheduled_date);

CREATE INDEX IF NOT EXISTS idx_payments_intervention ON payments(intervention_id);
CREATE INDEX IF NOT EXISTS idx_payments_client ON payments(client_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

CREATE INDEX IF NOT EXISTS idx_reviews_artisan ON reviews(artisan_id);
CREATE INDEX IF NOT EXISTS idx_reviews_client ON reviews(client_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

CREATE INDEX IF NOT EXISTS idx_contacts_user ON contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_artisan ON contacts(artisan_id);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON user_sessions(expires_at);

-- ==========================================
-- TRIGGERS
-- ==========================================

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Appliquer le trigger aux tables qui ont updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_artisans_updated_at BEFORE UPDATE ON artisans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_categories_updated_at BEFORE UPDATE ON service_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_types_updated_at BEFORE UPDATE ON service_types
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_requests_updated_at BEFORE UPDATE ON service_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interventions_updated_at BEFORE UPDATE ON interventions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour mettre à jour les statistiques des artisans
CREATE OR REPLACE FUNCTION update_artisan_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE artisans 
        SET rating = (
            SELECT COALESCE(AVG(rating), 0) 
            FROM reviews 
            WHERE artisan_id = NEW.artisan_id
        ),
        review_count = (
            SELECT COUNT(*) 
            FROM reviews 
            WHERE artisan_id = NEW.artisan_id
        )
        WHERE user_id = NEW.artisan_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE artisans 
        SET rating = (
            SELECT COALESCE(AVG(rating), 0) 
            FROM reviews 
            WHERE artisan_id = OLD.artisan_id
        ),
        review_count = (
            SELECT COUNT(*) 
            FROM reviews 
            WHERE artisan_id = OLD.artisan_id
        )
        WHERE user_id = OLD.artisan_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger sur la table reviews
CREATE TRIGGER trigger_update_artisan_stats
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_artisan_stats();

-- ==========================================
-- VUES UTILES
-- ==========================================

-- Vue pour les profils artisans complets
CREATE OR REPLACE VIEW artisan_profiles AS
SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.phone,
    a.category,
    a.description,
    a.experience,
    a.rating,
    a.review_count,
    a.is_verified,
    a.hourly_rate,
    a.location,
    a.availability,
    u.created_at
FROM users u
JOIN artisans a ON u.id = a.user_id
WHERE u.user_type = 'ARTISAN' AND u.is_active = TRUE;

-- Vue pour les demandes de service avec détails
CREATE OR REPLACE VIEW service_requests_details AS
SELECT 
    sr.id,
    sr.title,
    sr.description,
    sr.status,
    sr.location,
    sr.budget,
    sr.urgency,
    sr.preferred_date,
    sr.created_at,
    client.first_name || ' ' || client.last_name as client_name,
    client.phone as client_phone,
    client.email as client_email,
    artisan.first_name || ' ' || artisan.last_name as artisan_name,
    sc.label as category_label,
    st.label as service_type_label
FROM service_requests sr
JOIN users client ON sr.client_id = client.id
LEFT JOIN users artisan ON sr.artisan_id = artisan.id
LEFT JOIN service_categories sc ON sr.category_id = sc.id
LEFT JOIN service_types st ON sr.service_type_id = st.id;

-- Vue pour les interventions avec détails
CREATE OR REPLACE VIEW interventions_details AS
SELECT 
    i.id,
    i.title,
    i.description,
    i.status,
    i.scheduled_date,
    i.started_at,
    i.completed_at,
    i.duration_hours,
    i.actual_cost,
    i.created_at,
    client.first_name || ' ' || client.last_name as client_name,
    artisan.first_name || ' ' || artisan.last_name as artisan_name,
    sr.title as service_request_title,
    p.amount as payment_amount,
    p.status as payment_status
FROM interventions i
JOIN users client ON i.client_id = client.id
JOIN users artisan ON i.artisan_id = artisan.id
JOIN service_requests sr ON i.service_request_id = sr.id
LEFT JOIN payments p ON i.id = p.intervention_id;

-- ==========================================
-- SÉQUENCES DE NETTOYAGE
-- ==========================================

-- Fonction pour nettoyer les anciennes sessions expirées
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM user_sessions WHERE expires_at < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- COMMENTAIRES
-- ==========================================

COMMENT ON TABLE users IS 'Table principale des utilisateurs du système';
COMMENT ON TABLE artisans IS 'Profil détaillé des artisans avec leurs compétences';
COMMENT ON TABLE service_categories IS 'Catégories de services disponibles';
COMMENT ON TABLE service_types IS 'Types de services spécifiques dans chaque catégorie';
COMMENT ON TABLE service_requests IS 'Demandes de service faites par les clients';
COMMENT ON TABLE interventions IS 'Interventions planifiées et réalisées par les artisans';
COMMENT ON TABLE payments IS 'Paiements associés aux interventions';
COMMENT ON TABLE reviews IS 'Avis et évaluations donnés par les clients';
COMMENT ON TABLE notifications IS 'Notifications système pour les utilisateurs';
COMMENT ON TABLE contacts IS 'Demandes de contact depuis le formulaire de contact';
COMMENT ON TABLE user_sessions IS 'Sessions actives des utilisateurs';

-- ==========================================
-- FIN DU SCRIPT
-- ==========================================
