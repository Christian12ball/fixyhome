-- Création de la table notifications
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('INFO', 'SUCCESS', 'WARNING', 'ERROR')),
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    related_intervention_id BIGINT REFERENCES interventions(id) ON DELETE SET NULL,
    related_service_request_id BIGINT REFERENCES service_requests(id) ON DELETE SET NULL
);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read);

-- Index pour les relations
CREATE INDEX IF NOT EXISTS idx_notifications_intervention_id ON notifications(related_intervention_id);
CREATE INDEX IF NOT EXISTS idx_notifications_service_request_id ON notifications(related_service_request_id);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_notifications_updated_at
    BEFORE UPDATE ON notifications
    FOR EACH ROW
    EXECUTE FUNCTION update_notifications_updated_at();

-- Commentaires sur la table
COMMENT ON TABLE notifications IS 'Table pour stocker les notifications des utilisateurs';
COMMENT ON COLUMN notifications.id IS 'Identifiant unique de la notification';
COMMENT ON COLUMN notifications.user_id IS 'Référence à l''utilisateur destinataire';
COMMENT ON COLUMN notifications.message IS 'Contenu du message de notification';
COMMENT ON COLUMN notifications.type IS 'Type de notification (INFO, SUCCESS, WARNING, ERROR)';
COMMENT ON COLUMN notifications.read IS 'Indique si la notification a été lue';
COMMENT ON COLUMN notifications.created_at IS 'Date de création de la notification';
COMMENT ON COLUMN notifications.updated_at IS 'Date de dernière mise à jour';
COMMENT ON COLUMN notifications.related_intervention_id IS 'Référence optionnelle à une intervention liée';
COMMENT ON COLUMN notifications.related_service_request_id IS 'Référence optionnelle à une demande de service liée';
