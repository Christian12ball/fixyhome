-- Script de migration complète pour FixyHome
-- Ce script corrige tous les problèmes de structure de base de données

-- ==========================================
-- 1. Migration de la table service_categories
-- ==========================================

-- Ajouter la colonne name si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'service_categories' 
        AND column_name = 'name'
        AND table_schema = current_schema()
    ) THEN
        ALTER TABLE service_categories ADD COLUMN name VARCHAR(255);
        RAISE NOTICE 'Colonne name ajoutée à service_categories';
    END IF;
END $$;

-- Mettre à jour les enregistrements existants
UPDATE service_categories SET name = 'plumbing' WHERE label = 'Plomberie' AND (name IS NULL OR name = '');
UPDATE service_categories SET name = 'electricity' WHERE label = 'Électricité' AND (name IS NULL OR name = '');
UPDATE service_categories SET name = 'cleaning' WHERE label = 'Ménage' AND (name IS NULL OR name = '');
UPDATE service_categories SET name = 'gardening' WHERE label = 'Jardinage' AND (name IS NULL OR name = '');
UPDATE service_categories SET name = 'painting' WHERE label = 'Peinture' AND (name IS NULL OR name = '');
UPDATE service_categories SET name = 'carpentry' WHERE label = 'Menuiserie' AND (name IS NULL OR name = '');
UPDATE service_categories SET name = 'hvac' WHERE label = 'Climatisation' AND (name IS NULL OR name = '');
UPDATE service_categories SET name = 'roofing' WHERE label = 'Couverture' AND (name IS NULL OR name = '');
UPDATE service_categories SET name = 'moving' WHERE label = 'Déménagement' AND (name IS NULL OR name = '');
UPDATE service_categories SET name = 'security' WHERE label = 'Sécurité' AND (name IS NULL OR name = '');

-- Rendre la colonne non nulle
ALTER TABLE service_categories ALTER COLUMN name SET NOT NULL;

-- ==========================================
-- 2. Migration de la table artisans
-- ==========================================

-- Supprimer d'abord la vue qui dépend de la colonne category
DROP VIEW IF EXISTS artisan_profiles;

-- Ajouter la colonne category_id si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'artisans' 
        AND column_name = 'category_id'
        AND table_schema = current_schema()
    ) THEN
        ALTER TABLE artisans ADD COLUMN category_id BIGINT;
        RAISE NOTICE 'Colonne category_id ajoutée à artisans';
    END IF;
END $$;

-- Supprimer l'ancienne colonne category si elle existe
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'artisans' 
        AND column_name = 'category'
        AND table_schema = current_schema()
    ) THEN
        ALTER TABLE artisans DROP COLUMN category;
        RAISE NOTICE 'Ancienne colonne category supprimée de artisans';
    END IF;
END $$;

-- Ajouter la contrainte de clé étrangère
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_artisans_category'
        AND table_name = 'artisans'
        AND table_schema = current_schema()
    ) THEN
        ALTER TABLE artisans 
        ADD CONSTRAINT fk_artisans_category 
        FOREIGN KEY (category_id) REFERENCES service_categories(id);
        RAISE NOTICE 'Contrainte de clé étrangère ajoutée à artisans';
    END IF;
END $$;

-- Mettre à jour les artisans existants
UPDATE artisans 
SET category_id = (SELECT id FROM service_categories WHERE label = 'Plomberie' LIMIT 1)
WHERE category_id IS NULL;

-- Rendre la colonne non nulle
ALTER TABLE artisans ALTER COLUMN category_id SET NOT NULL;

-- Recréer la vue artisan_profiles avec la nouvelle structure
CREATE OR REPLACE VIEW artisan_profiles AS
SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.phone,
    u.created_at,
    a.description,
    a.experience,
    a.rating,
    a.review_count,
    a.is_verified,
    a.hourly_rate,
    a.location,
    sc.name as category_name,
    sc.label as category_label,
    sc.icon_url as category_icon
FROM users u
JOIN artisans a ON u.id = a.user_id
JOIN service_categories sc ON a.category_id = sc.id
WHERE u.user_type = 'ARTISAN' AND u.is_active = true AND a.is_verified = true;

-- ==========================================
-- 3. Migration de la table service_requests
-- ==========================================

-- Ajouter la colonne category_id si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'service_requests' 
        AND column_name = 'category_id'
        AND table_schema = current_schema()
    ) THEN
        ALTER TABLE service_requests ADD COLUMN category_id BIGINT;
        RAISE NOTICE 'Colonne category_id ajoutée à service_requests';
    END IF;
END $$;

-- Supprimer l'ancienne colonne category si elle existe
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'service_requests' 
        AND column_name = 'category'
        AND table_schema = current_schema()
    ) THEN
        ALTER TABLE service_requests DROP COLUMN category;
        RAISE NOTICE 'Ancienne colonne category supprimée de service_requests';
    END IF;
END $$;

-- Ajouter la contrainte de clé étrangère
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_service_requests_category'
        AND table_name = 'service_requests'
        AND table_schema = current_schema()
    ) THEN
        ALTER TABLE service_requests 
        ADD CONSTRAINT fk_service_requests_category 
        FOREIGN KEY (category_id) REFERENCES service_categories(id);
        RAISE NOTICE 'Contrainte de clé étrangère ajoutée à service_requests';
    END IF;
END $$;

-- Mettre à jour les service_requests existants
UPDATE service_requests 
SET category_id = (SELECT id FROM service_categories WHERE label = 'Plomberie' LIMIT 1)
WHERE category_id IS NULL;

-- Rendre la colonne non nulle
ALTER TABLE service_requests ALTER COLUMN category_id SET NOT NULL;

-- ==========================================
-- 4. Résumé de la migration
-- ==========================================

DO $$
DECLARE
    categories_count INTEGER;
    artisans_count INTEGER;
    requests_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO categories_count FROM service_categories;
    SELECT COUNT(*) INTO artisans_count FROM artisans;
    SELECT COUNT(*) INTO requests_count FROM service_requests;
    
    RAISE NOTICE '=== RÉSUMÉ DE LA MIGRATION COMPLÈTE ===';
    RAISE NOTICE 'Service categories: %', categories_count;
    RAISE NOTICE 'Artisans: %', artisans_count;
    RAISE NOTICE 'Service requests: %', requests_count;
    RAISE NOTICE '✅ Migration terminée avec succès !';
    RAISE NOTICE '=== FIN DE LA MIGRATION ===';
END $$;
