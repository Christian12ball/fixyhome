-- Création des tables pour les services et catégories

-- Table des catégories de services
CREATE TABLE IF NOT EXISTS service_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    label VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des types de services
CREATE TABLE IF NOT EXISTS service_types (
    id BIGSERIAL PRIMARY KEY,
    label VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    category_id BIGINT NOT NULL REFERENCES service_categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion des catégories par défaut
INSERT INTO service_categories (name, label, description, icon_url) VALUES
('plumbing', 'Plomberie', 'Installation, dépannage, entretien de vos installations sanitaires', '🔧'),
('electricity', 'Électricité', 'Mise aux normes, dépannage, installation électrique complète', '⚡'),
('cleaning', 'Ménage', 'Entretien régulier, grand nettoyage, services sur mesure', '🧹')
ON CONFLICT (name) DO NOTHING;

-- Insertion des services par défaut
INSERT INTO service_types (label, description, category_id, icon_url) VALUES
('Installation sanitaire', 'Installation complète de sanitaires (WC, lavabo, douche, baignoire)', 1, '🚽'),
('Débouchage canalisations', 'Débouchage rapide des canalisations bouchées', 1, '🔧'),
('Réparation fuites', 'Réparation des fuites d''eau et de gaz', 1, '🔧'),
('Chauffe-eau', 'Installation et entretien des chauffe-eau', 1, '🔥'),
('Mise aux normes électriques', 'Mise en conformité des installations électriques', 2, '⚡'),
('Dépannage électrique', 'Dépannage rapide des pannes électriques', 2, '⚡'),
('Installation luminaire', 'Installation de luminaires et points lumineux', 2, '💡'),
('Tableau électrique', 'Installation et mise à jour des tableaux électriques', 2, '🔌'),
('Nettoyage complet', 'Nettoyage en profondeur de toute la maison', 3, '🧹'),
('Entretien régulier', 'Entretien ménager hebdomadaire ou mensuel', 3, '🏠'),
('Grand nettoyage', 'Grand nettoyage de printemps ou avant déménagement', 3, '✨'),
('Nettoyage vitres', 'Nettoyage des vitres et fenêtres', 3, '🪟')
ON CONFLICT DO NOTHING;

-- Création des index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_service_categories_active ON service_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_service_types_active ON service_types(is_active);
CREATE INDEX IF NOT EXISTS idx_service_types_category ON service_types(category_id);

-- Trigger pour mettre à jour le champ updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_service_categories_updated_at BEFORE UPDATE ON service_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_types_updated_at BEFORE UPDATE ON service_types
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
