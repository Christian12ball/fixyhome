-- Structure complète de la table service_categories avec le champ name
-- Ce script peut être utilisé pour recréer la table avec la bonne structure

-- Supprimer la table existante si nécessaire (décommenter pour recréer)
-- DROP TABLE IF EXISTS service_categories;

-- Créer la table avec la structure correcte
CREATE TABLE IF NOT EXISTS service_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,           -- Champ name sans contrainte unique
    label VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insérer les données avec le champ name
INSERT INTO service_categories (name, label, description, icon_url, is_active, created_at, updated_at) VALUES
('plumbing', 'Plomberie', 'Installation, dépannage, entretien de vos installations sanitaires', '🔧', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('electricity', 'Électricité', 'Mise aux normes, dépannage, installation électrique complète', '⚡', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cleaning', 'Ménage', 'Entretien régulier, grand nettoyage, services sur mesure', '🧹', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('gardening', 'Jardinage', 'Paysagisme, entretien, aménagement extérieur', '🌿', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('painting', 'Peinture', 'Intérieur, extérieur, finitions parfaites', '🎨', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('carpentry', 'Menuiserie', 'Meubles sur mesure, rénovations, installations', '🔨', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('hvac', 'Climatisation', 'Installation, entretien, dépannage HVAC', '❄️', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('roofing', 'Couverture', 'Toiture, réparation, étanchéité', '🏠', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('moving', 'Déménagement', 'Transport, emballage, logistique complète', '🚚', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('security', 'Sécurité', 'Alarmes, caméras, systèmes de protection', '🔒', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (name) DO UPDATE SET
    label = EXCLUDED.label,
    description = EXCLUDED.description,
    icon_url = EXCLUDED.icon_url,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

-- Alternative: Si vous voulez garder les données existantes et juste ajouter le champ name
-- Utilisez plutôt le script simple_migration.sql

-- Afficher un résumé
DO $$
DECLARE
    category_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO category_count FROM service_categories;
    RAISE NOTICE '=== TABLE SERVICE_CATEGORIES ===';
    RAISE NOTICE 'Nombre de catégories: %', category_count;
    RAISE NOTICE 'Structure: id, name, label, description, icon_url, is_active, created_at, updated_at';
    RAISE NOTICE '=== CRÉATION TERMINÉE ===';
END $$;
