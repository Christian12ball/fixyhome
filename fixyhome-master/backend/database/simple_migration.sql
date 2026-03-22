-- Script de migration simple pour ajouter le champ 'name' à service_categories

-- Ajouter la colonne name si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'service_categories' 
        AND column_name = 'name'
        AND table_schema = current_schema()
    ) THEN
        ALTER TABLE service_categories ADD COLUMN name VARCHAR(255);
        RAISE NOTICE 'Colonne name ajoutée';
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

-- Rendre le champ non nul (sans contrainte unique)
ALTER TABLE service_categories ALTER COLUMN name SET NOT NULL;
-- La contrainte UNIQUE a été supprimée pour éviter les conflits
-- ALTER TABLE service_categories ADD CONSTRAINT service_categories_name_unique UNIQUE (name);

RAISE NOTICE 'Migration terminée avec succès';
