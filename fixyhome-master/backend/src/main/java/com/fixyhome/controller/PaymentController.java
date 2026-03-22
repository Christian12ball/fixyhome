package com.fixyhome.controller;

import com.fixyhome.model.Intervention;
import com.fixyhome.model.User;
import com.fixyhome.model.UserType;
import com.fixyhome.service.FarotyWalletService;
import com.fixyhome.service.InterventionService;
import com.fixyhome.service.NotificationService;
import com.fixyhome.repository.UserRepository;
import com.fixyhome.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping({"/api/payments", "/payments"})
@CrossOrigin(origins = "*", allowCredentials = "false")
public class PaymentController {
    
    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);
    
    private final FarotyWalletService farotyWalletService;
    private final InterventionService interventionService;
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    
    @Value("${app.base-url:http://localhost:3000}")
    private String appBaseUrl;
    
    @Value("${faroty.webhook.secret:whs_mGj5QgRlqgrFL8puchO-ZMk7QrXNbT1TYSxYAg}")
    private String webhookSecret;
    
    public PaymentController(FarotyWalletService farotyWalletService, 
                           InterventionService interventionService,
                           NotificationService notificationService,
                           UserRepository userRepository,
                           JwtUtil jwtUtil) {
        this.farotyWalletService = farotyWalletService;
        this.interventionService = interventionService;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }
    
    @PostMapping("/create-session/{interventionId}")
    @PreAuthorize("hasAuthority('ROLE_CLIENT')")
    public ResponseEntity<?> createPaymentSession(@PathVariable Long interventionId, HttpServletRequest request) {
        try {
            String token = extractToken(request);
            String clientEmail = jwtUtil.extractUsername(token);
            
            // Récupérer l'intervention
            Intervention intervention = interventionService.getInterventionById(interventionId);
            
            // Vérifier que le client est bien le client de cette intervention
            if (!intervention.getClient().getEmail().equals(clientEmail)) {
                return ResponseEntity.status(403).body("Vous n'êtes pas le client de cette intervention");
            }
            
            // Créer ou récupérer le wallet du client
            User client = intervention.getClient();
            String walletId;
            
            // Pour l'instant, nous utilisons l'ID utilisateur comme refId pour le wallet
            // Dans une implémentation réelle, il faudrait stocker le walletId dans la base de données
            try {
                walletId = farotyWalletService.createWallet(client.getId().toString());
            } catch (Exception e) {
                logger.warn("Erreur lors de la création du wallet (possible wallet existant): {}", e.getMessage());
                // Utiliser l'ID utilisateur comme walletId par défaut
                walletId = "wallet_" + client.getId();
            }
            
            // Calculer le montant (budget de la demande de service)
            int amount = intervention.getServiceRequest().getBudget();
            
            // Créer les URLs de retour
            String cancelUrl = appBaseUrl + "/dashboard/client/interventions";
            String successUrl = appBaseUrl + "/dashboard/client/payment/success?intervention=" + interventionId;
            
            // Créer la session de paiement
            Map<String, Object> sessionData = farotyWalletService.createPaymentSession(
                walletId,
                amount,
                cancelUrl,
                successUrl,
                "Paiement FixyHome - " + intervention.getServiceRequest().getTitle(),
                "Paiement pour le service: " + intervention.getServiceRequest().getDescription(),
                "" // URL d'image optionnelle
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("sessionUrl", sessionData.get("sessionUrl"));
            response.put("sessionToken", sessionData.get("sessionToken"));
            response.put("amount", amount);
            response.put("interventionId", interventionId);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Erreur lors de la création de la session de paiement: {}", e.getMessage(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Erreur lors de la création de la session de paiement: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    
    @PostMapping("/webhook")
    public ResponseEntity<?> handleWebhook(@RequestBody Map<String, Object> webhookData, 
                                         @RequestHeader("X-Faroty-Signature") String signature) {
        try {
            logger.info("Webhook reçu de Faroty: {}", webhookData);
            
            // Vérifier la signature (implémentation de base)
            if (!farotyWalletService.verifyWebhookSignature(
                webhookData.toString(), signature, webhookSecret)) {
                logger.warn("Signature webhook invalide");
                return ResponseEntity.status(401).body("Signature invalide");
            }
            
            // Traiter les données du webhook
            String eventType = (String) webhookData.get("eventType");
            Map<String, Object> paymentData = (Map<String, Object>) webhookData.get("data");
            
            if ("payment.completed".equals(eventType)) {
                handlePaymentCompleted(paymentData);
            } else if ("payment.failed".equals(eventType)) {
                handlePaymentFailed(paymentData);
            }
            
            return ResponseEntity.ok().build();
            
        } catch (Exception e) {
            logger.error("Erreur lors du traitement du webhook: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Erreur lors du traitement");
        }
    }
    
    private void handlePaymentCompleted(Map<String, Object> paymentData) {
        try {
            String sessionToken = (String) paymentData.get("sessionToken");
            String walletId = (String) paymentData.get("walletId");
            Integer amount = (Integer) paymentData.get("amount");
            
            logger.info("Paiement complété - Session: {}, Wallet: {}, Montant: {}", 
                       sessionToken, walletId, amount);
            
            // Récupérer l'intervention associée (basé sur le refId du wallet)
            String userId = walletId.replace("wallet_", "");
            User client = userRepository.findById(Long.valueOf(userId))
                .orElseThrow(() -> new RuntimeException("Client non trouvé: " + userId));
            
            // Mettre à jour le statut de l'intervention
            // Dans une implémentation réelle, il faudrait une table de suivi des paiements
            // Pour l'instant, nous allons notifier l'artisan
            
            // Notifier l'artisan que le paiement a été effectué
            notificationService.createPaymentCompletedNotification(
                "artisan@example.com", // À remplacer par l'email réel de l'artisan
                client.getFirstName() + " " + client.getLastName(),
                "Service payé"
            );
            
            logger.info("Paiement traité avec succès pour le client: {}", client.getEmail());
            
        } catch (Exception e) {
            logger.error("Erreur lors du traitement du paiement complété: {}", e.getMessage(), e);
        }
    }
    
    private void handlePaymentFailed(Map<String, Object> paymentData) {
        try {
            String sessionToken = (String) paymentData.get("sessionToken");
            String walletId = (String) paymentData.get("walletId");
            String errorMessage = (String) paymentData.get("errorMessage");
            
            logger.error("Paiement échoué - Session: {}, Wallet: {}, Erreur: {}", 
                        sessionToken, walletId, errorMessage);
            
            // Notifier le client de l'échec du paiement
            String userId = walletId.replace("wallet_", "");
            User client = userRepository.findById(Long.valueOf(userId))
                .orElseThrow(() -> new RuntimeException("Client non trouvé: " + userId));
            
            // Créer une notification d'échec
            notificationService.createNotificationForUser(
                client.getEmail(),
                "Le paiement a échoué. Veuillez réessayer ou contacter le support.",
                com.fixyhome.model.NotificationType.ERROR
            );
            
        } catch (Exception e) {
            logger.error("Erreur lors du traitement du paiement échoué: {}", e.getMessage(), e);
        }
    }
    
    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
