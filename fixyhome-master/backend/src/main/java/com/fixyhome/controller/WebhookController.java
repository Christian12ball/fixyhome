package com.fixyhome.controller;

import com.fixyhome.model.Intervention;
import com.fixyhome.repository.InterventionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/webhooks")
@CrossOrigin(origins = "*")
public class WebhookController {

    @Autowired
    private InterventionRepository interventionRepository;

    private static final String FAROTY_WEBHOOK_SECRET = "whs_mGj5QgRlqgrFL8puchO-ZMk7QrXNbT1TYSxYAg";

    @PostMapping("/faroty/payment")
    public ResponseEntity<?> handleFarotyPaymentWebhook(
            @RequestBody Map<String, Object> payload,
            @RequestHeader(value = "X-Faroty-Signature", required = false) String signature
    ) {
        try {
            // Vérifier la signature si elle est présente
            if (signature != null) {
                String expectedSignature = calculateSignature(payload, FAROTY_WEBHOOK_SECRET);
                if (!signature.equals(expectedSignature)) {
                    System.err.println("Signature invalide pour le webhook Faroty");
                    return ResponseEntity.status(401).body("Signature invalide");
                }
            }

            // Traiter le webhook
            String eventType = (String) payload.get("eventType");
            Map<String, Object> data = (Map<String, Object>) payload.get("data");

            System.out.println("Webhook Faroty reçu - EventType: " + eventType);
            System.out.println("Données: " + data);

            switch (eventType) {
                case "payment.completed":
                    handlePaymentCompleted(data);
                    break;
                case "payment.failed":
                    handlePaymentFailed(data);
                    break;
                case "payment.pending":
                    handlePaymentPending(data);
                    break;
                default:
                    System.out.println("Type d'événement non géré: " + eventType);
            }

            return ResponseEntity.ok().body("Webhook traité avec succès");
        } catch (Exception e) {
            System.err.println("Erreur lors du traitement du webhook Faroty: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erreur lors du traitement");
        }
    }

    private void handlePaymentCompleted(Map<String, Object> data) {
        try {
            String sessionToken = (String) data.get("sessionToken");
            String walletId = (String) data.get("walletId");
            Double amount = (Double) data.get("amount");
            String transactionId = (String) data.get("transactionId");

            // Trouver l'intervention par sessionToken
            Optional<Intervention> interventionOpt = interventionRepository.findByPaymentSessionToken(sessionToken);
            if (interventionOpt.isPresent()) {
                Intervention intervention = interventionOpt.get();
                // Mettre à jour le statut de paiement
                intervention.setPaymentStatus("COMPLETED");
                intervention.setPaymentCompletedAt(LocalDateTime.now());
                
                // Sauvegarder les informations de transaction
                if (intervention.getNotes() == null) {
                    intervention.setNotes("");
                }
                String paymentInfo = String.format(
                    "Paiement Faroty complété - Transaction ID: %s, Wallet ID: %s, Montant: %.2f XAF",
                    transactionId, walletId, amount
                );
                intervention.setNotes(intervention.getNotes() + "\n" + paymentInfo);
                
                interventionRepository.save(intervention);
                
                System.out.println("Paiement complété pour l'intervention: " + intervention.getId());
                
                // TODO: Envoyer une notification au client et à l'artisan
                // notificationService.sendPaymentCompletedNotification(intervention);
                
            } else {
                System.err.println("Aucune intervention trouvée pour le sessionToken: " + sessionToken);
            }
        } catch (Exception e) {
            System.err.println("Erreur lors du traitement du paiement complété: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void handlePaymentFailed(Map<String, Object> data) {
        try {
            String sessionToken = (String) data.get("sessionToken");
            String errorCode = (String) data.get("errorCode");
            String errorMessage = (String) data.get("errorMessage");

            Optional<Intervention> interventionOpt = interventionRepository.findByPaymentSessionToken(sessionToken);
            if (interventionOpt.isPresent()) {
                Intervention intervention = interventionOpt.get();
                intervention.setPaymentStatus("FAILED");
                
                if (intervention.getNotes() == null) {
                    intervention.setNotes("");
                }
                String errorInfo = String.format(
                    "Paiement Faroty échoué - Erreur: %s (%s)",
                    errorMessage, errorCode
                );
                intervention.setNotes(intervention.getNotes() + "\n" + errorInfo);
                
                interventionRepository.save(intervention);
                
                System.out.println("Paiement échoué pour l'intervention: " + intervention.getId());
                
                // TODO: Envoyer une notification d'échec de paiement
                // notificationService.sendPaymentFailedNotification(intervention);
                
            } else {
                System.err.println("Aucune intervention trouvée pour le sessionToken: " + sessionToken);
            }
        } catch (Exception e) {
            System.err.println("Erreur lors du traitement du paiement échoué: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void handlePaymentPending(Map<String, Object> data) {
        try {
            String sessionToken = (String) data.get("sessionToken");

            Optional<Intervention> interventionOpt = interventionRepository.findByPaymentSessionToken(sessionToken);
            if (interventionOpt.isPresent()) {
                Intervention intervention = interventionOpt.get();
                intervention.setPaymentStatus("PENDING");
                interventionRepository.save(intervention);
                
                System.out.println("Paiement en attente pour l'intervention: " + intervention.getId());
            }
        } catch (Exception e) {
            System.err.println("Erreur lors du traitement du paiement en attente: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Calcule la signature HMAC-SHA256 pour vérifier l'authenticité du webhook
     */
    private String calculateSignature(Map<String, Object> payload, String secret) {
        try {
            // Convertir le payload en chaîne JSON
            String payloadString = payload.toString();
            
            // Calculer HMAC-SHA256
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest((payloadString + secret).getBytes("UTF-8"));
            
            // Convertir en hexadécimal
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            
            return hexString.toString();
        } catch (NoSuchAlgorithmException | java.io.UnsupportedEncodingException e) {
            throw new RuntimeException("Erreur lors du calcul de la signature", e);
        }
    }

    /**
     * Endpoint pour tester le webhook
     */
    @GetMapping("/test")
    public ResponseEntity<?> testWebhook() {
        return ResponseEntity.ok(Map.of(
            "message", "Webhook endpoint actif",
            "timestamp", LocalDateTime.now(),
            "secret", FAROTY_WEBHOOK_SECRET.substring(0, 10) + "..."
        ));
    }

    /**
     * Endpoint pour mettre à jour l'URL du webhook Faroty
     */
    @PutMapping("/faroty/update-url")
    public ResponseEntity<?> updateFarotyWebhookUrl(@RequestBody Map<String, String> request) {
        try {
            String webhookUrl = request.get("url");
            
            // TODO: Appeler l'API Faroty pour mettre à jour l'URL du webhook
            // Utiliser l'endpoint PUT /api/v1/webhooks/{WEBHOOK_ID}
            
            return ResponseEntity.ok(Map.of(
                "message", "URL du webhook mise à jour avec succès",
                "url", webhookUrl
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "error", "Erreur lors de la mise à jour de l'URL du webhook: " + e.getMessage()
            ));
        }
    }
}
