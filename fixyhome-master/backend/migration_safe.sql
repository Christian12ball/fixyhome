-- Script de migration simple pour FixyHome
-- Ce script évite les problèmes de dépendances en utilisant une approche plus douce

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
-- 2. Migration de la table artisans (approche douce)
-- ==========================================

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

-- Mettre à jour les artisans existants avec la nouvelle colonne
UPDATE artisans 
SET category_id = (SELECT id FROM service_categories WHERE label = 'Plomberie' LIMIT 1)
WHERE category_id IS NULL;

-- Si l'ancienne colonne category existe, la renommer au lieu de la supprimer
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'artisans' 
        AND column_name = 'category'
        AND table_schema = current_schema()
    ) THEN
        -- Renommer l'ancienne colonne pour éviter les conflits
        ALTER TABLE artisans RENAME COLUMN category TO category_old;
        RAISE NOTICE 'Ancienne colonne category renommée en category_old';
    END IF;
END $$;

-- ==========================================
-- 3. Migration de la table service_requests (approche douce)
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

-- Mettre à jour les service_requests existants
UPDATE service_requests 
SET category_id = (SELECT id FROM service_categories WHERE label = 'Plomberie' LIMIT 1)
WHERE category_id IS NULL;

-- Si l'ancienne colonne category existe, la renommer
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'service_requests' 
        AND column_name = 'category'
        AND table_schema = current_schema()
    ) THEN
        ALTER TABLE service_requests RENAME COLUMN category TO category_old;
        RAISE NOTICE 'Ancienne colonne category renommée en category_old dans service_requests';
    END IF;
END $$;

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
    
    RAISE NOTICE '=== RÉSUMÉ DE LA MIGRATION DOUCE ===';
    RAISE NOTICE 'Service categories: %', categories_count;
    RAISE NOTICE 'Artisans: %', artisans_count;
    RAISE NOTICE 'Service requests: %', requests_count;
    RAISE NOTICE '✅ Migration douce terminée avec succès !';
    RAISE NOTICE 'Les anciennes colonnes ont été renommées en category_old';
    RAISE NOTICE '=== FIN DE LA MIGRATION ===';
END $$;
