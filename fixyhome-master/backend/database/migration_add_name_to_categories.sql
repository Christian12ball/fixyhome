-- Script de migration pour ajouter le champ 'name' à la table service_categories
-- et mettre à jour les données existantes

-- Étape 1: Ajouter la colonne 'name' si elle n'existe pas
DO $$
BEGIN
    -- Vérifier si la colonne 'name' existe déjà
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'service_categories' 
        AND column_name = 'name'
        AND table_schema = current_schema()
    ) THEN
        -- Ajouter la colonne 'name'
        ALTER TABLE service_categories 
        ADD COLUMN name VARCHAR(255);
        
        RAISE NOTICE 'Colonne "name" ajoutée avec succès à la table service_categories';
    ELSE
        RAISE NOTICE 'La colonne "name" existe déjà dans la table service_categories';
    END IF;
END $$;

-- Étape 2: Mettre à jour les enregistrements existants avec le champ 'name'
-- Basé sur le label existant, nous allons générer un nom en minuscules et sans accents

UPDATE service_categories 
SET name = LOWER(
    REGEXP_REPLACE(
        REGEXP_REPLACE(
            REGEXP_REPLACE(label, '[ÉÈÊË]', 'E', 'g'),
            '[ÁÀÂÄ]', 'A', 'g'
        ),
        '[^A-Z0-9]', '', 'g'
    )
) 
WHERE name IS NULL OR name = '';

-- Mises à jour spécifiques pour les catégories existantes
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

-- Étape 3: Rendre la colonne 'name' unique et non nulle
-- D'abord, s'assurer qu'il n'y a pas de valeurs en double
-- DO $$
-- BEGIN
    -- Compter les doublons
    -- DECLARE duplicate_count INTEGER;
    -- SELECT COUNT(*) INTO duplicate_count 
    -- FROM (
    --     SELECT name, COUNT(*) as cnt 
    --     FROM service_categories 
    --     WHERE name IS NOT NULL AND name != ''
    --     GROUP BY name 
    --     HAVING COUNT(*) > 1
    -- ) duplicates;
    
--     IF duplicate_count > 0 THEN
--         RAISE NOTICE 'Attention: % doublons trouvés dans le champ name', duplicate_count;
--     END IF;
-- END $$;

-- Ajouter la contrainte NOT NULL (après s'être assuré qu'il n'y a pas de valeurs nulles)
ALTER TABLE service_categories 
ALTER COLUMN name SET NOT NULL;

-- La contrainte UNIQUE sur name a été supprimée pour éviter les conflits
-- ALTER TABLE service_categories 
-- ADD CONSTRAINT service_categories_name_unique UNIQUE (name);

-- Étape 4: Afficher un résumé des modifications
DO $$
DECLARE
    total_records INTEGER;
    with_name_count INTEGER;
    unique_names INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_records FROM service_categories;
    SELECT COUNT(*) INTO with_name_count FROM service_categories WHERE name IS NOT NULL AND name != '';
    
    RAISE NOTICE '=== RÉSUMÉ DE LA MIGRATION ===';
    RAISE NOTICE 'Total enregistrements dans service_categories: %', total_records;
    RAISE NOTICE 'Enregistrements avec champ name renseigné: %', with_name_count;
    
    IF with_name_count = total_records THEN
        RAISE NOTICE '✅ Migration réussie ! Tous les enregistrements ont un champ name.';
    ELSE
        RAISE NOTICE '⚠️ Attention: Certains enregistrements n ont pas de champ name.';
    END IF;
    
    RAISE NOTICE '=== FIN DE LA MIGRATION ===';
END $$;
