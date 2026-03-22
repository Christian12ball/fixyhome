-- ==========================================
-- DONNÉES D'EXEMPLE POUR FIXYHOME
-- ==========================================
-- Script d'insertion des données de test pour le projet FixyHome
-- À exécuter après la création des tables avec fixyhome_database_complete.sql
-- Encodage UTF-8 pour supporter les accents

-- Configuration de l'encodage pour la session
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

-- ==========================================
-- UTILISATEURS DE BASE
-- ==========================================

-- Administrateur
INSERT INTO users (email, first_name, last_name, phone, password, user_type, is_active) VALUES
('admin@fixyhome.com', 'Admin', 'FixyHome', '+221770000001', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ADMIN', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Clients
INSERT INTO users (email, first_name, last_name, phone, password, user_type, is_active) VALUES
('jean.client@fixyhome.com', 'Jean', 'Dupont', '+221770000010', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'CLIENT', TRUE),
('marie.client@fixyhome.com', 'Marie', 'Curie', '+221770000011', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'CLIENT', TRUE),
('paul.client@fixyhome.com', 'Paul', 'Martin', '+221770000012', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'CLIENT', TRUE),
('sophie.client@fixyhome.com', 'Sophie', 'Bernard', '+221770000013', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'CLIENT', TRUE),
('pierre.client@fixyhome.com', 'Pierre', 'Petit', '+221770000014', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'CLIENT', TRUE),
('amelie.client@fixyhome.com', 'Amélie', 'Rousseau', '+221770000015', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'CLIENT', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Artisans
INSERT INTO users (email, first_name, last_name, phone, password, user_type, is_active) VALUES
('pierre.plombier@fixyhome.com', 'Pierre', 'Durand', '+221770000020', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE),
('sophie.electricienne@fixyhome.com', 'Sophie', 'Lefebvre', '+221770000021', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE),
('michel.menage@fixyhome.com', 'Michel', 'Bertrand', '+221770000022', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE),
('isabelle.jardinage@fixyhome.com', 'Isabelle', 'Moreau', '+221770000023', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE),
('robert.peinture@fixyhome.com', 'Robert', 'Garnier', '+221770000024', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE),
('marc.menuiserie@fixyhome.com', 'Marc', 'Dubois', '+221770000025', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE),
('chantal.climatisation@fixyhome.com', 'Chantal', 'Rousseau', '+221770000026', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE),
('antoine.couverture@fixyhome.com', 'Antoine', 'Petit', '+221770000027', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE),
('lucie.demenagement@fixyhome.com', 'Lucie', 'Martin', '+221770000028', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE),
('franck.securite@fixyhome.com', 'Franck', 'Leroy', '+221770000029', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jskrjPmfXtLa', 'ARTISAN', TRUE)
ON CONFLICT (email) DO NOTHING;

-- ==========================================
-- CATÉGORIES DE SERVICES
-- ==========================================

INSERT INTO service_categories (label, description, icon_url, is_active) VALUES
('Plomberie', 'Services de plomberie pour dépannage, installation et entretien', '/icons/plumbing.svg', TRUE),
('Électricité', 'Services électriques pour installation, dépannage et mise aux normes', '/icons/electricity.svg', TRUE),
('Ménage', 'Services de nettoyage et entretien domestique', '/icons/cleaning.svg', TRUE),
('Jardinage', 'Services d''aménagement et entretien de jardins', '/icons/gardening.svg', TRUE),
('Peinture', 'Services de peinture intérieure et extérieure', '/icons/painting.svg', TRUE),
('Menuiserie', 'Travaux de menuiserie et ébénisterie', '/icons/carpentry.svg', TRUE),
('Climatisation', 'Installation et entretien de systèmes de climatisation', '/icons/hvac.svg', TRUE),
('Couverture', 'Travaux de toiture et couverture', '/icons/roofing.svg', TRUE),
('Déménagement', 'Services de déménagement et transport', '/icons/moving.svg', TRUE),
('Sécurité', 'Systèmes de sécurité et surveillance', '/icons/security.svg', TRUE)
ON CONFLICT (label) DO NOTHING;

-- ==========================================
-- TYPES DE SERVICES
-- ==========================================

-- Plomberie
INSERT INTO service_types (label, description, category_id, is_active) VALUES
('Débouchage canalisations', 'Débouchage de canalisations bouchées, éviers, WC', (SELECT id FROM service_categories WHERE label = 'Plomberie'), TRUE),
('Installation sanitaires', 'Pose de lavabos, WC, douches, baignoires', (SELECT id FROM service_categories WHERE label = 'Plomberie'), TRUE),
('Réparation fuites', 'Détection et réparation de fuites d''eau', (SELECT id FROM service_categories WHERE label = 'Plomberie'), TRUE),
('Chauffe-eau', 'Installation et entretien de chauffe-eau', (SELECT id FROM service_categories WHERE label = 'Plomberie'), TRUE),
('Plomberie générale', 'Travaux de plomberie complets', (SELECT id FROM service_categories WHERE label = 'Plomberie'), TRUE)
ON CONFLICT DO NOTHING;

-- Électricité
INSERT INTO service_types (label, description, category_id, is_active) VALUES
('Mise aux normes', 'Mise aux normes électriques', (SELECT id FROM service_categories WHERE label = 'Électricité'), TRUE),
('Tableau électrique', 'Installation et remplacement de tableaux électriques', (SELECT id FROM service_categories WHERE label = 'Électricité'), TRUE),
('Éclairage', 'Installation et dépannage d''éclairage', (SELECT id FROM service_categories WHERE label = 'Électricité'), TRUE),
('Prises et interrupteurs', 'Installation de prises et interrupteurs', (SELECT id FROM service_categories WHERE label = 'Électricité'), TRUE),
('Dépannage électrique', 'Dépannage électrique urgent', (SELECT id FROM service_categories WHERE label = 'Électricité'), TRUE)
ON CONFLICT DO NOTHING;

-- Ménage
INSERT INTO service_types (label, description, category_id, is_active) VALUES
('Ménage régulier', 'Entretien ménager hebdomadaire', (SELECT id FROM service_categories WHERE label = 'Ménage'), TRUE),
('Grand nettoyage', 'Nettoyage en profondeur', (SELECT id FROM service_categories WHERE label = 'Ménage'), TRUE),
('Nettoyage vitres', 'Lavage de vitres et fenêtres', (SELECT id FROM service_categories WHERE label = 'Ménage'), TRUE),
('Repassage', 'Service de repassage', (SELECT id FROM service_categories WHERE label = 'Ménage'), TRUE),
('Nettoyage fin de chantier', 'Nettoyage après travaux', (SELECT id FROM service_categories WHERE label = 'Ménage'), TRUE)
ON CONFLICT DO NOTHING;

-- Jardinage
INSERT INTO service_types (label, description, category_id, is_active) VALUES
('Tonte de pelouse', 'Tonte et entretien de pelouse', (SELECT id FROM service_categories WHERE label = 'Jardinage'), TRUE),
('Taille de haies', 'Taille et entretien de haies', (SELECT id FROM service_categories WHERE label = 'Jardinage'), TRUE),
('Plantation', 'Plantation d''arbres et arbustes', (SELECT id FROM service_categories WHERE label = 'Jardinage'), TRUE),
('Aménagement paysager', 'Création et aménagement d''espaces verts', (SELECT id FROM service_categories WHERE label = 'Jardinage'), TRUE),
('Désherbage', 'Désherbage et entretien des massifs', (SELECT id FROM service_categories WHERE label = 'Jardinage'), TRUE)
ON CONFLICT DO NOTHING;

-- ==========================================
-- PROFILS ARTISANS
-- ==========================================

INSERT INTO artisans (user_id, category, description, experience, rating, review_count, is_verified, hourly_rate, location, availability) VALUES
((SELECT id FROM users WHERE email = 'pierre.plombier@fixyhome.com'), 'PLUMBING', 'Plombier expérimenté spécialisé en dépannage rapide et installations sanitaires. Disponible 7j/7 pour urgences.', 12, 4.5, 28, TRUE, 45, 'Dakar, Plateau', 'Lundi-Vendredi: 8h-18h, Samedi: 9h-12h'),
((SELECT id FROM users WHERE email = 'sophie.electricienne@fixyhome.com'), 'ELECTRICITY', 'Électricienne certifiée avec 8 ans d''expérience. Spécialisée en mise aux normes et installations neuves.', 8, 4.8, 15, TRUE, 50, 'Dakar, Almadies', 'Lundi-Vendredi: 8h-17h'),
((SELECT id FROM users WHERE email = 'michel.menage@fixyhome.com'), 'CLEANING', 'Service de ménage professionnel depuis 6 ans. Équipe de 3 personnes disponible pour tous types de nettoyage.', 6, 4.3, 22, TRUE, 25, 'Dakar, Grand Yoff', 'Lundi-Samedi: 7h-19h'),
((SELECT id FROM users WHERE email = 'isabelle.jardinage@fixyhome.com'), 'GARDENING', 'Paysagiste passionnée avec 10 ans d''expérience. Création de jardins et entretien complet.', 10, 4.6, 18, TRUE, 35, 'Dakar, Ouakam', 'Lundi-Vendredi: 7h-17h'),
((SELECT id FROM users WHERE email = 'robert.peinture@fixyhome.com'), 'PAINTING', 'Peintre professionnel spécialisé en intérieur et extérieur. Travail soigné et matériaux de qualité.', 15, 4.7, 31, TRUE, 40, 'Dakar, Mermoz', 'Lundi-Vendredi: 8h-18h'),
((SELECT id FROM users WHERE email = 'marc.menuiserie@fixyhome.com'), 'CARPENTRY', 'Menuisier-ébéniste avec 20 ans d''expérience. Fabrication sur mesure et rénovation.', 20, 4.9, 42, TRUE, 55, 'Dakar, Sacré-Cœur', 'Lundi-Vendrei: 8h-17h'),
((SELECT id FROM users WHERE email = 'chantal.climatisation@fixyhome.com'), 'HVAC', 'Technicienne en climatisation et chauffage. Installation et entretien de tous types de systèmes.', 7, 4.4, 12, TRUE, 48, 'Dakar, Point E', 'Lundi-Vendredi: 8h-18h'),
((SELECT id FROM users WHERE email = 'antoine.couverture@fixyhome.com'), 'ROOFING', 'Couvreur spécialisé en toiture traditionnelle et moderne. Réparation et rénovation complète.', 18, 4.5, 25, TRUE, 60, 'Dakar, Biscuiterie', 'Lundi-Vendredi: 7h-17h'),
((SELECT id FROM users WHERE email = 'lucie.demenagement@fixyhome.com'), 'MOVING', 'Service de déménagement professionnel. Équipe équipée pour tous types de déménagements.', 5, 4.2, 8, TRUE, 30, 'Dakar, Patte d''Oie', 'Lundi-Samedi: 8h-18h'),
((SELECT id FROM users WHERE email = 'franck.securite@fixyhome.com'), 'SECURITY', 'Spécialiste en systèmes de sécurité. Installation de caméras, alarmes et contrôle d''accès.', 9, 4.6, 14, TRUE, 52, 'Dakar, Yoff', 'Lundi-Vendredi: 9h-17h')
ON CONFLICT (user_id) DO NOTHING;

-- ==========================================
-- DEMANDES DE SERVICE
-- ==========================================

INSERT INTO service_requests (title, description, category_id, service_type_id, client_id, location, budget, urgency, preferred_date, status) VALUES
('Fuite d''eau dans la cuisine', 'J''ai une fuite d''eau importante sous mon évier de cuisine depuis hier soir. J''ai besoin d''un plombier rapidement.', (SELECT id FROM service_categories WHERE label = 'Plomberie'), (SELECT id FROM service_types WHERE label = 'Réparation fuites'), (SELECT id FROM users WHERE email = 'jean.client@fixyhome.com'), 'Dakar, Plateau', 5000, 'URGENT', CURRENT_DATE + INTERVAL '1 day', 'COMPLETED'),
('Installation de prises électriques', 'Je souhaite faire installer 3 nouvelles prises électriques dans mon salon et une dans ma chambre.', (SELECT id FROM service_categories WHERE label = 'Électricité'), (SELECT id FROM service_types WHERE label = 'Prises et interrupteurs'), (SELECT id FROM users WHERE email = 'marie.client@fixyhome.com'), 'Dakar, Almadies', 8000, 'NORMAL', CURRENT_DATE + INTERVAL '3 days', 'ACCEPTED'),
('Grand nettoyage de maison', 'J''ai besoin d''un grand nettoyage de ma maison de 120m² avant de déménager. 3 chambres, salon, cuisine, 2 salles de bain.', (SELECT id FROM service_categories WHERE label = 'Ménage'), (SELECT id FROM service_types WHERE label = 'Grand nettoyage'), (SELECT id FROM users WHERE email = 'paul.client@fixyhome.com'), 'Dakar, Grand Yoff', 15000, 'NORMAL', CURRENT_DATE + INTERVAL '5 days', 'PENDING'),
('Taille de haies et tonte', 'Je cherche quelqu''un pour tailler mes haies et tondre la pelouse. Jardin d''environ 200m².', (SELECT id FROM service_categories WHERE label = 'Jardinage'), (SELECT id FROM service_types WHERE label = 'Taille de haies'), (SELECT id FROM users WHERE email = 'sophie.client@fixyhome.com'), 'Dakar, Ouakam', 6000, 'NORMAL', CURRENT_DATE + INTERVAL '2 days', 'IN_PROGRESS'),
('Peinture salon et chambre', 'Je souhaite repeindre mon salon (environ 30m²) et une chambre (15m²). Fourniture des peintures comprise si possible.', (SELECT id FROM service_categories WHERE label = 'Peinture'), (SELECT id FROM service_types WHERE label = 'Peinture'), (SELECT id FROM users WHERE email = 'pierre.client@fixyhome.com'), 'Dakar, Mermoz', 25000, 'NORMAL', CURRENT_DATE + INTERVAL '7 days', 'PENDING'),
('Installation climatisation', 'Installation d''une climatisation split dans ma chambre principale. Surface environ 20m².', (SELECT id FROM service_categories WHERE label = 'Climatisation'), (SELECT id FROM service_types WHERE label = 'Installation et entretien de systèmes de climatisation'), (SELECT id FROM users WHERE email = 'amelie.client@fixyhome.com'), 'Dakar, Point E', 120000, 'NORMAL', CURRENT_DATE + INTERVAL '4 days', 'PENDING')
ON CONFLICT DO NOTHING;

-- ==========================================
-- INTERVENTIONS
-- ==========================================

INSERT INTO interventions (service_request_id, artisan_id, client_id, title, description, status, scheduled_date, started_at, completed_at, duration_hours, actual_cost, notes) VALUES
((SELECT id FROM service_requests WHERE title = 'Fuite d''eau dans la cuisine'), (SELECT id FROM users WHERE email = 'pierre.plombier@fixyhome.com'), (SELECT id FROM users WHERE email = 'jean.client@fixyhome.com'), 'Réparation fuite cuisine', 'Diagnostic et réparation de la fuite sous l''évier. Remplacement du joint défectueux.', 'COMPLETED', CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE - INTERVAL '2 days' + INTERVAL '2 hours', 2, 4500, 'Intervention rapide et efficace. Client satisfait.'),
((SELECT id FROM service_requests WHERE title = 'Installation de prises électriques'), (SELECT id FROM users WHERE email = 'sophie.electricienne@fixyhome.com'), (SELECT id FROM users WHERE email = 'marie.client@fixyhome.com'), 'Installation 4 prises électriques', 'Installation de 3 prises dans le salon et 1 dans la chambre avec passage de câbles.', 'IN_PROGRESS', CURRENT_DATE + INTERVAL '1 day', CURRENT_DATE + INTERVAL '1 day', NULL, NULL, NULL, 'Matériel prévu. Intervention planifiée.'),
((SELECT id FROM service_requests WHERE title = 'Taille de haies et tonte'), (SELECT id FROM users WHERE email = 'isabelle.jardinage@fixyhome.com'), (SELECT id FROM users WHERE email = 'sophie.client@fixyhome.com'), 'Entretien jardin', 'Tonte pelouse et taille des haies sur 200m².', 'SCHEDULED', CURRENT_DATE + INTERVAL '2 days', NULL, NULL, NULL, NULL, 'Outils prévus. Durée estimée : 3 heures.')
ON CONFLICT DO NOTHING;

-- ==========================================
-- PAIEMENTS
-- ==========================================

INSERT INTO payments (intervention_id, client_id, amount, status, payment_method, payment_date) VALUES
((SELECT id FROM interventions WHERE title = 'Réparation fuite cuisine'), (SELECT id FROM users WHERE email = 'jean.client@fixyhome.com'), 4500, 'COMPLETED', 'CASH', CURRENT_DATE - INTERVAL '2 days')
ON CONFLICT DO NOTHING;

-- ==========================================
-- AVIS
-- ==========================================

INSERT INTO reviews (rating, comment, client_id, artisan_id, service_request_id, intervention_id) VALUES
(5, 'Excellent travail ! Pierre est intervenu rapidement et a résolu mon problème de fuite en moins de 2 heures. Très professionnel et prix raisonnable.', (SELECT id FROM users WHERE email = 'jean.client@fixyhome.com'), (SELECT id FROM users WHERE email = 'pierre.plombier@fixyhome.com'), (SELECT id FROM service_requests WHERE title = 'Fuite d''eau dans la cuisine'), (SELECT id FROM interventions WHERE title = 'Réparation fuite cuisine')),
(4, 'Sophie a fait un bon travail pour l''installation de mes prises. Ponctuelle et travail soigné. Je recommande !', (SELECT id FROM users WHERE email = 'marie.client@fixyhome.com'), (SELECT id FROM users WHERE email = 'sophie.electricienne@fixyhome.com'), (SELECT id FROM service_requests WHERE title = 'Installation de prises électriques'), NULL),
(5, 'Isabelle est passionnée par son travail. Mon jardin n''a jamais été aussi beau ! Elle a même donné des conseils pour l''entretien.', (SELECT id FROM users WHERE email = 'sophie.client@fixyhome.com'), (SELECT id FROM users WHERE email = 'isabelle.jardinage@fixyhome.com'), (SELECT id FROM service_requests WHERE title = 'Taille de haies et tonte'), NULL)
ON CONFLICT DO NOTHING;

-- ==========================================
-- NOTIFICATIONS
-- ==========================================

INSERT INTO notifications (user_id, title, message, type, is_read, related_id) VALUES
-- Notifications pour Jean (client)
((SELECT id FROM users WHERE email = 'jean.client@fixyhome.com'), 'Nouvelle demande acceptée', 'Votre demande de service "Fuite d''eau dans la cuisine" a été acceptée par Pierre Durand.', 'SERVICE_REQUEST', TRUE, (SELECT id FROM service_requests WHERE title = 'Fuite d''eau dans la cuisine')),
((SELECT id FROM users WHERE email = 'jean.client@fixyhome.com'), 'Intervention terminée', 'L''intervention pour votre demande "Fuite d''eau dans la cuisine" est terminée.', 'INTERVENTION_UPDATE', TRUE, (SELECT id FROM interventions WHERE title = 'Réparation fuite cuisine')),
((SELECT id FROM users WHERE email = 'jean.client@fixyhome.com'), 'Paiement confirmé', 'Votre paiement de 4500 FCFA a été reçu avec succès.', 'PAYMENT', TRUE, (SELECT id FROM payments WHERE amount = 4500)),

-- Notifications pour Marie (client)
((SELECT id FROM users WHERE email = 'marie.client@fixyhome.com'), 'Nouvelle demande acceptée', 'Votre demande "Installation de prises électriques" a été acceptée par Sophie Lefebvre.', 'SERVICE_REQUEST', FALSE, (SELECT id FROM service_requests WHERE title = 'Installation de prises électriques')),

-- Notifications pour Pierre (artisan)
((SELECT id FROM users WHERE email = 'pierre.plombier@fixyhome.com'), 'Nouvelle demande de service', 'Vous avez une nouvelle demande de service : "Fuite d''eau dans la cuisine".', 'SERVICE_REQUEST', TRUE, (SELECT id FROM service_requests WHERE title = 'Fuite d''eau dans la cuisine')),
((SELECT id FROM users WHERE email = 'pierre.plombier@fixyhome.com'), 'Nouvel avis reçu', 'Vous avez reçu un nouvel avis de 5 étoiles pour votre intervention.', 'REVIEW', TRUE, (SELECT id FROM reviews WHERE rating = 5 AND artisan_id = (SELECT id FROM users WHERE email = 'pierre.plombier@fixyhome.com'))),

-- Notifications pour Sophie (artisan)
((SELECT id FROM users WHERE email = 'sophie.electricienne@fixyhome.com'), 'Nouvelle demande de service', 'Vous avez une nouvelle demande de service : "Installation de prises électriques".', 'SERVICE_REQUEST', TRUE, (SELECT id FROM service_requests WHERE title = 'Installation de prises électriques')),
((SELECT id FROM users WHERE email = 'sophie.electricienne@fixyhome.com'), 'Nouvel avis reçu', 'Vous avez reçu un nouvel avis de 4 étoiles.', 'REVIEW', TRUE, (SELECT id FROM reviews WHERE rating = 4 AND artisan_id = (SELECT id FROM users WHERE email = 'sophie.electricienne@fixyhome.com')))
ON CONFLICT DO NOTHING;

-- ==========================================
-- CONTACTS
-- ==========================================

INSERT INTO contacts (name, email, phone, subject, message, user_id, artisan_id, contact_method, status) VALUES
('Avis Client', 'client@exemple.com', '+221770000100', 'Avis sur le service', 'Je souhaite donner mon avis sur le service rendu par Pierre Durand. Très satisfait !', (SELECT id FROM users WHERE email = 'jean.client@fixyhome.com'), (SELECT id FROM users WHERE email = 'pierre.plombier@fixyhome.com'), 'EMAIL', 'COMPLETED'),
('Demande Information', 'info@exemple.com', '+221770000101', 'Information sur les tarifs', 'Bonjour, je souhaite connaître les tarifs pour un service de ménage régulier pour un appartement de 80m². Merci', NULL, NULL, 'EMAIL', 'PENDING'),
('Contact Urgent', 'urgent@exemple.com', '+221770000102', 'Dépannage urgent', 'Urgence ! J''ai une panne d''électricité totale. J''ai besoin d''un électricien dès que possible.', NULL, NULL, 'PHONE', 'COMPLETED')
ON CONFLICT DO NOTHING;

-- ==========================================
-- SESSIONS (EXEMPLE)
-- ==========================================

INSERT INTO user_sessions (user_id, token, expires_at) VALUES
((SELECT id FROM users WHERE email = 'jean.client@fixyhome.com'), 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c', CURRENT_TIMESTAMP + INTERVAL '24 hours'),
((SELECT id FROM users WHERE email = 'pierre.plombier@fixyhome.com'), 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlBpZXJyZSBEdXJhbmQiLCJpYXQiOjE1MTYyMzkwMjJ9.9AdF1C7QqA6kXQN5w2kLdVQqQJYKzW6X7w2kLdVQqQJYKzW6X7w2kLdVQqQJYKzW6X7w', CURRENT_TIMESTAMP + INTERVAL '24 hours')
ON CONFLICT DO NOTHING;

-- ==========================================
-- STATISTIQUES FINALES
-- ==========================================

-- Afficher les statistiques après insertion
DO $$
BEGIN
    RAISE NOTICE '=== STATISTIQUES DE LA BASE DE DONNÉES ===';
    RAISE NOTICE 'Utilisateurs totaux: %', (SELECT COUNT(*) FROM users);
    RAISE NOTICE 'Clients: %', (SELECT COUNT(*) FROM users WHERE user_type = 'CLIENT');
    RAISE NOTICE 'Artisans: %', (SELECT COUNT(*) FROM users WHERE user_type = 'ARTISAN');
    RAISE NOTICE 'Administrateurs: %', (SELECT COUNT(*) FROM users WHERE user_type = 'ADMIN');
    RAISE NOTICE 'Catégories de services: %', (SELECT COUNT(*) FROM service_categories);
    RAISE NOTICE 'Types de services: %', (SELECT COUNT(*) FROM service_types);
    RAISE NOTICE 'Demandes de service: %', (SELECT COUNT(*) FROM service_requests);
    RAISE NOTICE 'Interventions: %', (SELECT COUNT(*) FROM interventions);
    RAISE NOTICE 'Paiements: %', (SELECT COUNT(*) FROM payments);
    RAISE NOTICE 'Avis: %', (SELECT COUNT(*) FROM reviews);
    RAISE NOTICE 'Notifications: %', (SELECT COUNT(*) FROM notifications);
    RAISE NOTICE 'Contacts: %', (SELECT COUNT(*) FROM contacts);
    RAISE NOTICE 'Sessions actives: %', (SELECT COUNT(*) FROM user_sessions WHERE expires_at > CURRENT_TIMESTAMP);
    RAISE NOTICE '========================================';
END $$;

-- ==========================================
-- FIN DU SCRIPT
-- ==========================================
