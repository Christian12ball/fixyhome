-- ==========================================
-- AJOUT D'ARTISANS POUR CHAQUE SERVICE - FIXYHOME
-- ==========================================
-- Script pour ajouter des artisans supplémentaires pour chaque catégorie de service
-- Encodage UTF-8 pour supporter les accents

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

-- ==========================================
-- UTILISATEURS ARTISANS SUPPLÉMENTAIRES
-- ==========================================

-- Plomberie - Artisans supplémentaires
INSERT INTO users (email, first_name, last_name, phone, password, user_type, is_active) VALUES
('thomas.plombier@fixyhome.com', 'Thomas', 'Bernard', '+221770000030', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE),
('marc.plombier@fixyhome.com', 'Marc', 'Laurent', '+221770000031', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE),
('david.plombier@fixyhome.com', 'David', 'Petit', '+221770000032', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Électricité - Artisans supplémentaires
INSERT INTO users (email, first_name, last_name, phone, password, user_type, is_active) VALUES
('nathalie.electricienne@fixyhome.com', 'Nathalie', 'Martin', '+221770000040', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE),
('vincent.electricien@fixyhome.com', 'Vincent', 'Rousseau', '+221770000041', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE),
('stephane.electricien@fixyhome.com', 'Stéphane', 'Leroy', '+221770000042', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Ménage - Artisans supplémentaires
INSERT INTO users (email, first_name, last_name, phone, password, user_type, is_active) VALUES
('fatou.menage@fixyhome.com', 'Fatou', 'Diop', '+221770000050', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE),
('awa.menage@fixyhome.com', 'Awa', 'Ndiaye', '+221770000051', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE),
('marie.menage@fixyhome.com', 'Marie', 'Fall', '+221770000052', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Jardinage - Artisans supplémentaires
INSERT INTO users (email, first_name, last_name, phone, password, user_type, is_active) VALUES
('ibrahima.jardinage@fixyhome.com', 'Ibrahim', 'Sarr', '+221770000060', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE),
('oumar.jardinage@fixyhome.com', 'Oumar', 'Ba', '+221770000061', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE),
('moussa.jardinage@fixyhome.com', 'Moussa', 'Cisse', '+221770000062', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Peinture - Artisans supplémentaires
INSERT INTO users (email, first_name, last_name, phone, password, user_type, is_active) VALUES
('julien.peinture@fixyhome.com', 'Julien', 'Gauthier', '+221770000070', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE),
('nicolas.peinture@fixyhome.com', 'Nicolas', 'Durand', '+221770000071', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE),
('alexandre.peinture@fixyhome.com', 'Alexandre', 'Morel', '+221770000072', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Menuiserie - Artisans supplémentaires
INSERT INTO users (email, first_name, last_name, phone, password, user_type, is_active) VALUES
('sebastien.menuiserie@fixyhome.com', 'Sébastien', 'Blanc', '+221770000080', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE),
('guillaume.menuiserie@fixyhome.com', 'Guillaume', 'Rouge', '+221770000081', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE),
('antoine.menuiserie@fixyhome.com', 'Antoine', 'Noir', '+221770000082', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Climatisation - Artisans supplémentaires
INSERT INTO users (email, first_name, last_name, phone, password, user_type, is_active) VALUES
('laurent.climatisation@fixyhome.com', 'Laurent', 'Garcia', '+221770000090', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE),
('pierre.climatisation@fixyhome.com', 'Pierre', 'Silva', '+221770000091', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE),
('olivier.climatisation@fixyhome.com', 'Olivier', 'Costa', '+221770000092', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Couverture - Artisans supplémentaires
INSERT INTO users (email, first_name, last_name, phone, password, user_type, is_active) VALUES
('philippe.couverture@fixyhome.com', 'Philippe', 'Martinez', '+221770000100', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE),
('christophe.couverture@fixyhome.com', 'Christophe', 'Lopez', '+221770000101', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE),
('david.couverture@fixyhome.com', 'David', 'Fernandez', '+221770000102', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Déménagement - Artisans supplémentaires
INSERT INTO users (email, first_name, last_name, phone, password, user_type, is_active) VALUES
('eric.demenagement@fixyhome.com', 'Eric', 'Dubois', '+221770000110', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE),
('patrice.demenagement@fixyhome.com', 'Patrice', 'Lambert', '+221770000111', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE),
('francois.demenagement@fixyhome.com', 'François', 'Muller', '+221770000112', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Sécurité - Artisans supplémentaires
INSERT INTO users (email, first_name, last_name, phone, password, user_type, is_active) VALUES
('jean-pierre.securite@fixyhome.com', 'Jean-Pierre', 'Schmidt', '+221770000120', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE),
('michel.securite@fixyhome.com', 'Michel', 'Wagner', '+221770000121', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE),
('jean-luc.securite@fixyhome.com', 'Jean-Luc', 'Fischer', '+221770000122', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE)
ON CONFLICT (email) DO NOTHING;

-- ==========================================
-- PROFILS ARTISANS SUPPLÉMENTAIRES
-- ==========================================

-- Plomberie - Artisans supplémentaires
INSERT INTO artisans (user_id, category, description, experience, rating, review_count, is_verified, hourly_rate, location, availability) VALUES
((SELECT id FROM users WHERE email = 'thomas.plombier@fixyhome.com'), 'PLUMBING', 'Plombier spécialisé en installations neuves et rénovations complètes. Certifié RGE.', 8, 4.6, 19, TRUE, 48, 'Dakar, Plateau', 'Lundi-Vendredi: 8h-18h, Samedi: 9h-12h'),
((SELECT id FROM users WHERE email = 'marc.plombier@fixyhome.com'), 'PLUMBING', 'Expert en dépannage plomberie d''urgence. Disponible 24h/24 et jours fériés.', 15, 4.8, 34, TRUE, 55, 'Dakar, Almadies', '24h/24 - Urgence'),
((SELECT id FROM users WHERE email = 'david.plombier@fixyhome.com'), 'PLUMBING', 'Plombier généraliste avec 6 ans d''expérience. Travail soigné et rapide.', 6, 4.2, 11, TRUE, 42, 'Dakar, Grand Yoff', 'Lundi-Vendredi: 8h-17h')
ON CONFLICT (user_id) DO NOTHING;

-- Électricité - Artisans supplémentaires
INSERT INTO artisans (user_id, category, description, experience, rating, review_count, is_verified, hourly_rate, location, availability) VALUES
((SELECT id FROM users WHERE email = 'nathalie.electricienne@fixyhome.com'), 'ELECTRICITY', 'Électricienne spécialisée en installations domotiques et systèmes intelligents.', 12, 4.9, 27, TRUE, 58, 'Dakar, Point E', 'Lundi-Vendredi: 8h-18h'),
((SELECT id FROM users WHERE email = 'vincent.electricien@fixyhome.com'), 'ELECTRICITY', 'Électricien industriel et résidentiel. Habilité pour les installations haute tension.', 10, 4.5, 22, TRUE, 52, 'Dakar, Ouakam', 'Lundi-Vendredi: 7h-19h'),
((SELECT id FROM users WHERE email = 'stephane.electricien@fixyhome.com'), 'ELECTRICITY', 'Électricien polyvalent spécialisé en rénovation et mise aux normes.', 7, 4.3, 16, TRUE, 45, 'Dakar, Mermoz', 'Lundi-Vendredi: 8h-17h')
ON CONFLICT (user_id) DO NOTHING;

-- Ménage - Artisans supplémentaires
INSERT INTO artisans (user_id, category, description, experience, rating, review_count, is_verified, hourly_rate, location, availability) VALUES
((SELECT id FROM users WHERE email = 'fatou.menage@fixyhome.com'), 'CLEANING', 'Service de ménage professionnel. Équipe de 4 personnes pour grands volumes.', 8, 4.7, 25, TRUE, 28, 'Dakar, Plateau', 'Lundi-Samedi: 7h-19h'),
((SELECT id FROM users WHERE email = 'awa.menage@fixyhome.com'), 'CLEANING', 'Spécialiste en nettoyage fin de chantier et vitrerie. Matériel professionnel fourni.', 5, 4.4, 18, TRUE, 32, 'Dakar, Almadies', 'Lundi-Samedi: 8h-18h'),
((SELECT id FROM users WHERE email = 'marie.menage@fixyhome.com'), 'CLEANING', 'Service de ménage et repassage. Travail méticuleux et fiable.', 6, 4.6, 20, TRUE, 30, 'Dakar, Grand Yoff', 'Lundi-Vendredi: 8h-17h')
ON CONFLICT (user_id) DO NOTHING;

-- Jardinage - Artisans supplémentaires
INSERT INTO artisans (user_id, category, description, experience, rating, review_count, is_verified, hourly_rate, location, availability) VALUES
((SELECT id FROM users WHERE email = 'ibrahima.jardinage@fixyhome.com'), 'GARDENING', 'Paysagiste spécialisé en jardins méditerranéens et irrigation automatique.', 14, 4.8, 31, TRUE, 38, 'Dakar, Ouakam', 'Lundi-Vendredi: 7h-17h'),
((SELECT id FROM users WHERE email = 'oumar.jardinage@fixyhome.com'), 'GARDENING', 'Jardinier expert en entretien de terrasses et balcons. Petits et grands espaces.', 9, 4.5, 23, TRUE, 35, 'Dakar, Point E', 'Lundi-Samedi: 8h-18h'),
((SELECT id FROM users WHERE email = 'moussa.jardinage@fixyhome.com'), 'GARDENING', 'Spécialiste en tonte, taille et désherbage. Matériel moderne disponible.', 7, 4.3, 15, TRUE, 32, 'Dakar, Grand Yoff', 'Lundi-Vendredi: 8h-17h')
ON CONFLICT (user_id) DO NOTHING;

-- Peinture - Artisans supplémentaires
INSERT INTO artisans (user_id, category, description, experience, rating, review_count, is_verified, hourly_rate, location, availability) VALUES
((SELECT id FROM users WHERE email = 'julien.peinture@fixyhome.com'), 'PAINTING', 'Peintre décorateur spécialisé en finitions haut de gamme et effets spéciaux.', 12, 4.9, 28, TRUE, 45, 'Dakar, Almadies', 'Lundi-Vendredi: 8h-18h'),
((SELECT id FROM users WHERE email = 'nicolas.peinture@fixyhome.com'), 'PAINTING', 'Peintre polyvalent intérieur/extérieur. Préparation des surfaces comprise.', 9, 4.6, 21, TRUE, 42, 'Dakar, Plateau', 'Lundi-Vendredi: 8h-17h'),
((SELECT id FROM users WHERE email = 'alexandre.peinture@fixyhome.com'), 'PAINTING', 'Peintre rapide et soigné. Spécialiste en rénovation rapide de locaux.', 6, 4.4, 13, TRUE, 38, 'Dakar, Mermoz', 'Lundi-Samedi: 8h-18h')
ON CONFLICT (user_id) DO NOTHING;

-- Menuiserie - Artisans supplémentaires
INSERT INTO artisans (user_id, category, description, experience, rating, review_count, is_verified, hourly_rate, location, availability) VALUES
((SELECT id FROM users WHERE email = 'sebastien.menuiserie@fixyhome.com'), 'CARPENTRY', 'Menuisier spécialisé en cuisines sur mesure et aménagement dressing.', 16, 4.9, 35, TRUE, 52, 'Dakar, Point E', 'Lundi-Vendredi: 8h-17h'),
((SELECT id FROM users WHERE email = 'guillaume.menuiserie@fixyhome.com'), 'CARPENTRY', 'Ébéniste traditionnel et moderne. Restauration de meubles anciens.', 11, 4.7, 26, TRUE, 48, 'Dakar, Ouakam', 'Lundi-Vendredi: 8h-18h'),
((SELECT id FROM users WHERE email = 'antoine.menuiserie@fixyhome.com'), 'CARPENTRY', 'Menuisier polyvalent. Agencement, placards, portes, fenêtres.', 8, 4.5, 19, TRUE, 45, 'Dakar, Sacré-Cœur', 'Lundi-Vendredi: 8h-17h')
ON CONFLICT (user_id) DO NOTHING;

-- Climatisation - Artisans supplémentaires
INSERT INTO artisans (user_id, category, description, experience, rating, review_count, is_verified, hourly_rate, location, availability) VALUES
((SELECT id FROM users WHERE email = 'laurent.climatisation@fixyhome.com'), 'HVAC', 'Technicien expert en climatisation réversible et pompes à chaleur.', 11, 4.8, 24, TRUE, 55, 'Dakar, Almadies', 'Lundi-Vendredi: 8h-18h'),
((SELECT id FROM users WHERE email = 'pierre.climatisation@fixyhome.com'), 'HVAC', 'Spécialiste en installation et maintenance de systèmes HVAC industriels.', 9, 4.6, 18, TRUE, 50, 'Dakar, Plateau', 'Lundi-Vendredi: 8h-17h'),
((SELECT id FROM users WHERE email = 'olivier.climatisation@fixyhome.com'), 'HVAC', 'Technicien en climatisation et chauffage. Contrats d''entretien annuels.', 7, 4.4, 12, TRUE, 48, 'Dakar, Grand Yoff', 'Lundi-Vendredi: 8h-18h')
ON CONFLICT (user_id) DO NOTHING;

-- Couverture - Artisans supplémentaires
INSERT INTO artisans (user_id, category, description, experience, rating, review_count, is_verified, hourly_rate, location, availability) VALUES
((SELECT id FROM users WHERE email = 'philippe.couverture@fixyhome.com'), 'ROOFING', 'Couvreur spécialisé en toiture plate et étanchéité. Garantie décennale.', 13, 4.7, 29, TRUE, 58, 'Dakar, Point E', 'Lundi-Vendredi: 7h-17h'),
((SELECT id FROM users WHERE email = 'christophe.couverture@fixyhome.com'), 'ROOFING', 'Couvreur traditionnel spécialisé en tuiles et ardoises. Rénovation complète.', 17, 4.9, 38, TRUE, 62, 'Dakar, Ouakam', 'Lundi-Vendredi: 8h-17h'),
((SELECT id FROM users WHERE email = 'david.couverture@fixyhome.com'), 'ROOFING', 'Couvreur polyvalent. Toiture métallique et charpente bois.', 8, 4.5, 16, TRUE, 55, 'Dakar, Mermoz', 'Lundi-Vendredi: 8h-17h')
ON CONFLICT (user_id) DO NOTHING;

-- Déménagement - Artisans supplémentaires
INSERT INTO artisans (user_id, category, description, experience, rating, review_count, is_verified, hourly_rate, location, availability) VALUES
((SELECT id FROM users WHERE email = 'eric.demenagement@fixyhome.com'), 'MOVING', 'Service de déménagement international. Emballage et déballage compris.', 12, 4.8, 22, TRUE, 65, 'Dakar, Plateau', 'Lundi-Samedi: 8h-18h'),
((SELECT id FROM users WHERE email = 'patrice.demenagement@fixyhome.com'), 'MOVING', 'Déménageur spécialisé en objets fragiles et œuvres d''art.', 8, 4.6, 14, TRUE, 55, 'Dakar, Almadies', 'Lundi-Samedi: 8h-18h'),
((SELECT id FROM users WHERE email = 'francois.demenagement@fixyhome.com'), 'MOVING', 'Déménagement local et régional. Camions de 3 à 20m³ disponibles.', 6, 4.4, 9, TRUE, 45, 'Dakar, Grand Yoff', 'Lundi-Samedi: 8h-18h')
ON CONFLICT (user_id) DO NOTHING;

-- Sécurité - Artisans supplémentaires
INSERT INTO artisans (user_id, category, description, experience, rating, review_count, is_verified, hourly_rate, location, availability) VALUES
((SELECT id FROM users WHERE email = 'jean-pierre.securite@fixyhome.com'), 'SECURITY', 'Expert en systèmes de sécurité connectés et domotique. Certifié APSAD.', 14, 4.9, 26, TRUE, 60, 'Dakar, Point E', 'Lundi-Vendredi: 9h-18h'),
((SELECT id FROM users WHERE email = 'michel.securite@fixyhome.com'), 'SECURITY', 'Spécialiste en vidéosurveillance et contrôle d''accès. Maintenance 24h/24.', 10, 4.7, 19, TRUE, 55, 'Dakar, Plateau', 'Lundi-Vendredi: 8h-18h'),
((SELECT id FROM users WHERE email = 'jean-luc.securite@fixyhome.com'), 'SECURITY', 'Technicien en alarmes et systèmes anti-intrusion. Installation rapide.', 7, 4.5, 11, TRUE, 50, 'Dakar, Ouakam', 'Lundi-Vendredi: 8h-17h')
ON CONFLICT (user_id) DO NOTHING;

-- ==========================================
-- RÉSUMÉ DES AJOUTS
-- ==========================================

-- Total ajouté : 30 artisans supplémentaires (3 par catégorie)
-- Répartition par catégorie :
-- Plomberie : 3 artisans (Thomas, Marc, David)
-- Électricité : 3 artisans (Nathalie, Vincent, Stéphane)
-- Ménage : 3 artisans (Fatou, Awa, Marie)
-- Jardinage : 3 artisans (Ibrahim, Oumar, Moussa)
-- Peinture : 3 artisans (Julien, Nicolas, Alexandre)
-- Menuiserie : 3 artisans (Sébastien, Guillaume, Antoine)
-- Climatisation : 3 artisans (Laurent, Pierre, Olivier)
-- Couverture : 3 artisans (Philippe, Christophe, David)
-- Déménagement : 3 artisans (Eric, Patrice, François)
-- Sécurité : 3 artisans (Jean-Pierre, Michel, Jean-Luc)

-- Tous les artisans ont :
-- - 6 à 17 ans d'expérience
-- - Rating de 4.2 à 4.9
-- - 9 à 35 avis clients
-- - Tous vérifiés (is_verified = TRUE)
-- - Taux horaire de 25€ à 65€ selon spécialité
-- - Disponibilités spécifiques
-- - Localisation à Dakar et environs
