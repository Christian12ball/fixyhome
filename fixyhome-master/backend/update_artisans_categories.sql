-- Script simple pour mettre à jour les category_id des artisans
-- Ce script met à jour tous les artisans avec une catégorie par défaut

-- Mettre à jour les artisans existants avec des catégories basées sur leur description
UPDATE artisans 
SET category_id = (
    CASE 
        WHEN LOWER(description) LIKE '%plomb%' THEN (SELECT id FROM service_categories WHERE name = 'plumbing' LIMIT 1)
        WHEN LOWER(description) LIKE '%électric%' OR LOWER(description) LIKE '%electric%' THEN (SELECT id FROM service_categories WHERE name = 'electricity' LIMIT 1)
        WHEN LOWER(description) LIKE '%ménage%' OR LOWER(description) LIKE '%nettoy%' THEN (SELECT id FROM service_categories WHERE name = 'cleaning' LIMIT 1)
        WHEN LOWER(description) LIKE '%jardin%' OR LOWER(description) LIKE '%paysag%' THEN (SELECT id FROM service_categories WHERE name = 'gardening' LIMIT 1)
        WHEN LOWER(description) LIKE '%peint%' THEN (SELECT id FROM service_categories WHERE name = 'painting' LIMIT 1)
        WHEN LOWER(description) LIKE '%menuis%' OR LOWER(description) LIKE '%ébén%' THEN (SELECT id FROM service_categories WHERE name = 'carpentry' LIMIT 1)
        WHEN LOWER(description) LIKE '%climat%' OR LOWER(description) LIKE '%chauff%' THEN (SELECT id FROM service_categories WHERE name = 'hvac' LIMIT 1)
        WHEN LOWER(description) LIKE '%toit%' OR LOWER(description) LIKE '%couvert%' THEN (SELECT id FROM service_categories WHERE name = 'roofing' LIMIT 1)
        WHEN LOWER(description) LIKE '%déménag%' OR LOWER(description) LIKE '%transport%' THEN (SELECT id FROM service_categories WHERE name = 'moving' LIMIT 1)
        WHEN LOWER(description) LIKE '%sécur%' OR LOWER(description) LIKE '%alarm%' OR LOWER(description) LIKE '%caméra%' THEN (SELECT id FROM service_categories WHERE name = 'security' LIMIT 1)
        ELSE (SELECT id FROM service_categories WHERE name = 'plumbing' LIMIT 1) -- Catégorie par défaut
    END
)
WHERE category_id IS NULL;

-- Afficher un résumé
DO $$
DECLARE
    updated_count INTEGER;
    total_artisans INTEGER;
BEGIN
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    SELECT COUNT(*) INTO total_artisans FROM artisans;
    
    RAISE NOTICE '=== MISE À JOUR DES ARTISANS ===';
    RAISE NOTICE 'Artisans mis à jour: %', updated_count;
    RAISE NOTICE 'Total artisans: %', total_artisans;
    RAISE NOTICE '=== OPÉRATION TERMINÉE ===';
END $$;
