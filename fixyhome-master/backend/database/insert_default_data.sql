-- Insertion des données par défaut pour les catégories et services
-- Ce script insère les données de base si elles n'existent pas déjà

-- Insertion des catégories par défaut
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
ON CONFLICT (name) DO NOTHING;

-- Insertion des services par défaut
INSERT INTO service_types (label, description, icon_url, category_id, is_active, created_at, updated_at) VALUES
-- Services de plomberie (category_id = 1)
('Installation sanitaire', 'Installation complète de sanitaires (WC, lavabo, douche, baignoire)', '🚽', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Débouchage canalisations', 'Débouchage rapide des canalisations bouchées', '🔧', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Réparation fuites', 'Réparation des fuites d''eau et de gaz', '🔧', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Chauffe-eau', 'Installation et entretien des chauffe-eau', '🔥', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Services d'électricité (category_id = 2)
('Mise aux normes électriques', 'Mise en conformité des installations électriques', '⚡', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Dépannage électrique', 'Dépannage rapide des pannes électriques', '⚡', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Installation luminaire', 'Installation de luminaires et points lumineux', '💡', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Tableau électrique', 'Installation et mise à jour des tableaux électriques', '🔌', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Services de ménage (category_id = 3)
('Nettoyage complet', 'Nettoyage en profondeur de toute la maison', '🧹', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Entretien régulier', 'Entretien ménager hebdomadaire ou mensuel', '🏠', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Grand nettoyage', 'Grand nettoyage de printemps ou avant déménagement', '✨', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Nettoyage vitres', 'Nettoyage des vitres et fenêtres', '🪟', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Services de jardinage (category_id = 4)
('Paysagisme', 'Création et aménagement de jardins', '🌳', 4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Entretien jardin', 'Tonte, taille, désherbage régulier', '🌿', 4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Arboriculture', 'Taille et abattage d''arbres', '🪓', 4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Irrigation', 'Installation et entretien de systèmes d''arrosage', '💧', 4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Services de peinture (category_id = 5)
('Peinture intérieure', 'Peinture des murs, plafonds et surfaces intérieures', '🎨', 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Peinture extérieure', 'Peinture des façades et surfaces extérieures', '🖌️', 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Préparation surfaces', 'Sablage, ponçage, préparation avant peinture', '🔧', 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Finitions', 'Vernis, lasures, protections diverses', '✨', 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Services de menuiserie (category_id = 6)
('Meubles sur mesure', 'Fabrication de meubles personnalisés', '🪑', 6, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Rénovation bois', 'Restauration et rénovation de boiseries', '🔨', 6, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Parquets', 'Installation et rénovation de parquets', '🪵', 6, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Agencement', 'Aménagement d''espaces de rangement', '📦', 6, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Services de climatisation (category_id = 7)
('Installation clim', 'Pose de systèmes de climatisation', '❄️', 7, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Entretien clim', 'Maintenance et nettoyage de climatisations', '🔧', 7, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Dépannage clim', 'Réparation des pannes de climatisation', '⚡', 7, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Pompes à chaleur', 'Installation et maintenance de pompes à chaleur', '🌡️', 7, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Services de couverture (category_id = 8)
('Toiture neuve', 'Installation complète de toitures', '🏠', 8, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Réparation toiture', 'Réparation de fuites et dégradations', '🔧', 8, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Étanchéité', 'Application de membranes d''étanchéité', '🛡️', 8, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Gouttières', 'Installation et nettoyage de gouttières', '💧', 8, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Services de déménagement (category_id = 9)
('Déménagement local', 'Transport sur courte distance', '🚚', 9, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Déménagement national', 'Transport sur longue distance', '🇫🇷', 9, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Emballage', 'Service d''emballage professionnel', '📦', 9, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Montage meubles', 'Montage et installation de meubles', '🔧', 9, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Services de sécurité (category_id = 10)
('Alarmes', 'Installation de systèmes d''alarme', '🚨', 10, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Vidéosurveillance', 'Pose de caméras de surveillance', '📹', 10, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Contrôle d''accès', 'Installation de systèmes de contrôle d''accès', '🔑', 10, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Sécurité incendie', 'Installation de détecteurs et extincteurs', '🔥', 10, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Afficher un résumé
DO $$
DECLARE
    category_count INTEGER;
    service_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO category_count FROM service_categories;
    SELECT COUNT(*) INTO service_count FROM service_types;
    
    RAISE NOTICE '=== RÉSUMÉ DE L''INSERTION ===';
    RAISE NOTICE 'Nombre de catégories dans la base: %', category_count;
    RAISE NOTICE 'Nombre de services dans la base: %', service_count;
    RAISE NOTICE '=== DONNÉES INSÉRÉES AVEC SUCCÈS ===';
END $$;
