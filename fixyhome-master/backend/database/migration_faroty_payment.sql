-- Migration pour ajouter les champs de paiement Faroty à la table interventions
-- Exécuter ce script sur votre base de données PostgreSQL

-- Ajouter les colonnes de paiement à la table interventions
ALTER TABLE interventions 
ADD COLUMN IF NOT EXISTS payment_session_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'PENDING',
ADD COLUMN IF NOT EXISTS payment_completed_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP;

-- Ajouter des index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_interventions_payment_session_token ON interventions(payment_session_token);
CREATE INDEX IF NOT EXISTS idx_interventions_payment_status ON interventions(payment_status);
CREATE INDEX IF NOT EXISTS idx_interventions_completed_at ON interventions(completed_at);

-- Ajouter des contraintes pour les statuts de paiement
ALTER TABLE interventions 
ADD CONSTRAINT IF NOT EXISTS chk_payment_status 
CHECK (payment_status IN ('PENDING', 'COMPLETED', 'FAILED', NULL));

-- Mettre à jour les interventions existantes pour avoir un statut par défaut
UPDATE interventions 
SET payment_status = 'PENDING' 
WHERE payment_status IS NULL;

-- Commentaire sur les nouvelles colonnes
COMMENT ON COLUMN interventions.payment_session_token IS 'Token de session de paiement Faroty';
COMMENT ON COLUMN interventions.payment_status IS 'Statut du paiement: PENDING, COMPLETED, FAILED';
COMMENT ON COLUMN interventions.payment_completed_at IS 'Date et heure de complétion du paiement';
COMMENT ON COLUMN interventions.completed_at IS 'Date et heure de complétion de l''intervention par l''artisan';

-- Afficher un résumé des modifications
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'interventions' 
    AND column_name IN ('payment_session_token', 'payment_status', 'payment_completed_at', 'completed_at')
ORDER BY column_name;
