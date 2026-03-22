-- Script de migration pour la table artisans
-- Ajout de la colonne category_id et mise à jour de la structure

-- Étape 1: Ajouter la colonne category_id si elle n'existe pas
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
        RAISE NOTICE 'Colonne category_id ajoutée à la table artisans';
    ELSE
        RAISE NOTICE 'La colonne category_id existe déjà dans la table artisans';
    END IF;
END $$;

-- Étape 2: Supprimer l'ancienne colonne category si elle existe
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
        RAISE NOTICE 'Ancienne colonne category supprimée';
    END IF;
END $$;

-- Étape 3: Ajouter la contrainte de clé étrangère
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
        RAISE NOTICE 'Contrainte de clé étrangère ajoutée';
    END IF;
END $$;

-- Étape 4: Mettre à jour les artisans existants avec une catégorie par défaut
UPDATE artisans 
SET category_id = (SELECT id FROM service_categories WHERE label = 'Plomberie' LIMIT 1)
WHERE category_id IS NULL;

-- Étape 5: Rendre la colonne non nulle
ALTER TABLE artisans 
ALTER COLUMN category_id SET NOT NULL;

-- Étape 6: Afficher un résumé
DO $$
DECLARE
    artisan_count INTEGER;
    with_category_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO artisan_count FROM artisans;
    SELECT COUNT(*) INTO with_category_count FROM artisans WHERE category_id IS NOT NULL;
    
    RAISE NOTICE '=== RÉSUMÉ DE LA MIGRATION ARTISANS ===';
    RAISE NOTICE 'Total artisans: %', artisan_count;
    RAISE NOTICE 'Artisans avec category_id: %', with_category_count;
    
    IF with_category_count = artisan_count THEN
        RAISE NOTICE '✅ Migration artisans réussie !';
    ELSE
        RAISE NOTICE '⚠️ Certains artisans n ont pas de category_id';
    END IF;
    
    RAISE NOTICE '=== FIN DE LA MIGRATION ARTISANS ===';
END $$;
