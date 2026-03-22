package com.fixyhome.controller;

import com.fixyhome.model.Intervention;
import com.fixyhome.model.User;
import com.fixyhome.repository.InterventionRepository;
import com.fixyhome.repository.UserRepository;
import com.fixyhome.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/faroty")
@CrossOrigin(origins = "*")
public class FarotyController {

    @Autowired
    private InterventionRepository interventionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private final RestTemplate restTemplate = new RestTemplate();

    // Configuration Faroty
    private static final String FAROTY_AUTH_BASE_URL = "https://api-prod.faroty.me/auth/api/auth";
    private static final String FAROTY_PAY_BASE_URL = "https://api-pay-prod.faroty.me/payments/api/v1";
    private static final String ACCOUNT_ID = "816ac7c4-f55d-4c90-9772-92ca78e2ab17";
    private static final String API_KEY = "fk_live_mhZG1htEBgK02jvI5QZqNYTpzgdfFmMCisI8cho4KbxqSD9uq2l6h39XppRSayQVTtAj5pCAjRU";
    private static final String WEBHOOK_SECRET = "whs_mGj5QgRlqgrFL8puchO-ZMk7QrXNbT1TYSxYAg";
    private static final String WEBHOOK_ID = "d4c411c0-fc50-4d56-a3a5-21c47a26cc66";

    @PostMapping("/login")
    public ResponseEntity<?> loginFaroty(@RequestBody Map<String, Object> request) {
        try {
            String contact = (String) request.get("contact");
            Map<String, Object> deviceInfo = (Map<String, Object>) request.get("deviceInfo");

            Map<String, Object> farotyRequest = new HashMap<>();
            farotyRequest.put("contact", contact);
            farotyRequest.put("deviceInfo", deviceInfo);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(farotyRequest, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                FAROTY_AUTH_BASE_URL + "/login",
                entity,
                Map.class
            );

            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Erreur lors du login Faroty: " + e.getMessage()));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, Object> request) {
        try {
            String otpCode = (String) request.get("otpCode");
            String tempToken = (String) request.get("tempToken");
            Map<String, Object> deviceInfo = (Map<String, Object>) request.get("deviceInfo");

            Map<String, Object> farotyRequest = new HashMap<>();
            farotyRequest.put("otpCode", otpCode);
            farotyRequest.put("tempToken", tempToken);
            farotyRequest.put("deviceInfo", deviceInfo);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(farotyRequest, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                FAROTY_AUTH_BASE_URL + "/verify-otp",
                entity,
                Map.class
            );

            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Erreur lors de la vérification OTP: " + e.getMessage()));
        }
    }

    @PostMapping("/create-wallet")
    public ResponseEntity<?> createWallet(@RequestBody Map<String, Object> request) {
        try {
            String legalIdentifier = (String) request.get("legalIdentifier");
            String refId = (String) request.get("refId");

            Map<String, Object> farotyRequest = new HashMap<>();
            farotyRequest.put("accountId", ACCOUNT_ID);
            farotyRequest.put("currencyCode", "XAF");
            farotyRequest.put("walletType", "PERSONAL");
            farotyRequest.put("legalIdentifier", legalIdentifier);
            farotyRequest.put("refId", refId);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(farotyRequest, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                FAROTY_PAY_BASE_URL + "/wallets",
                entity,
                Map.class
            );

            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Erreur lors de la création du wallet: " + e.getMessage()));
        }
    }

    @PostMapping("/create-payment-session")
    public ResponseEntity<?> createPaymentSession(@RequestBody Map<String, Object> request) {
        try {
            String walletId = (String) request.get("walletId");
            Double amount = (Double) request.get("amount");
            String cancelUrl = (String) request.get("cancelUrl");
            String successUrl = (String) request.get("successUrl");
            Long interventionId = (Long) request.get("interventionId");

            Map<String, Object> farotyRequest = new HashMap<>();
            farotyRequest.put("walletId", walletId);
            farotyRequest.put("currencyCode", "XAF");
            farotyRequest.put("cancelUrl", cancelUrl);
            farotyRequest.put("successUrl", successUrl);
            farotyRequest.put("type", "DEPOSIT");
            farotyRequest.put("amount", amount);
            farotyRequest.put("contentType", "CAMPAIGN_SIMPLE");

            Map<String, Object> dynamicContentData = new HashMap<>();
            dynamicContentData.put("title", "Paiement FixyHome");
            dynamicContentData.put("description", "Paiement pour services d'artisan");
            dynamicContentData.put("target", amount + " XAF");
            dynamicContentData.put("imageUrl", "https://media.faroty.me/api/media/public/c3e256db-6c97-48a7-8e8d-f2ba1d568727.jpg");
            farotyRequest.put("dynamicContentData", dynamicContentData);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-API-KEY", API_KEY);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(farotyRequest, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                FAROTY_PAY_BASE_URL + "/payment-sessions",
                entity,
                Map.class
            );

            // Mettre à jour l'intervention avec les infos de paiement
            if (interventionId != null && response.getBody() != null) {
                Optional<Intervention> interventionOpt = interventionRepository.findById(interventionId);
                if (interventionOpt.isPresent()) {
                    Intervention intervention = interventionOpt.get();
                    Map<String, Object> responseData = (Map<String, Object>) response.getBody().get("data");
                    intervention.setPaymentSessionToken((String) responseData.get("sessionToken"));
                    intervention.setPaymentStatus("PENDING");
                    interventionRepository.save(intervention);
                }
            }

            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Erreur lors de la création de la session de paiement: " + e.getMessage()));
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<?> handleWebhook(@RequestBody Map<String, Object> payload, HttpServletRequest request) {
        try {
            String signature = request.getHeader("X-Faroty-Signature");
            
            // TODO: Vérifier la signature avec WEBHOOK_SECRET
            // String expectedSignature = calculateSignature(payload, WEBHOOK_SECRET);
            // if (!expectedSignature.equals(signature)) {
            //     return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            // }

            // Traiter le webhook
            String eventType = (String) payload.get("eventType");
            Map<String, Object> data = (Map<String, Object>) payload.get("data");

            switch (eventType) {
                case "payment.completed":
                    handlePaymentCompleted(data);
                    break;
                case "payment.failed":
                    handlePaymentFailed(data);
                    break;
                default:
                    System.out.println("Webhook event non géré: " + eventType);
            }

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    private void handlePaymentCompleted(Map<String, Object> data) {
        try {
            String sessionToken = (String) data.get("sessionToken");
            
            // Trouver l'intervention par sessionToken
            Optional<Intervention> interventionOpt = interventionRepository.findByPaymentSessionToken(sessionToken);
            if (interventionOpt.isPresent()) {
                Intervention intervention = interventionOpt.get();
                intervention.setPaymentStatus("COMPLETED");
                intervention.setPaymentCompletedAt(java.time.LocalDateTime.now());
                interventionRepository.save(intervention);
                
                System.out.println("Paiement complété pour l'intervention: " + intervention.getId());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void handlePaymentFailed(Map<String, Object> data) {
        try {
            String sessionToken = (String) data.get("sessionToken");
            
            Optional<Intervention> interventionOpt = interventionRepository.findByPaymentSessionToken(sessionToken);
            if (interventionOpt.isPresent()) {
                Intervention intervention = interventionOpt.get();
                intervention.setPaymentStatus("FAILED");
                interventionRepository.save(intervention);
                
                System.out.println("Paiement échoué pour l'intervention: " + intervention.getId());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @PutMapping("/webhook-url")
    public ResponseEntity<?> updateWebhookUrl(@RequestBody Map<String, Object> request) {
        try {
            String url = (String) request.get("url");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-Account-ID", ACCOUNT_ID);
            headers.set("X-API-KEY", API_KEY);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(Map.of("url", url), headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                FAROTY_PAY_BASE_URL + "/webhooks/" + WEBHOOK_ID,
                HttpMethod.PUT,
                entity,
                Map.class
            );

            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Erreur lors de la mise à jour du webhook: " + e.getMessage()));
        }
    }

    // Endpoint pour que l'artisan marque l'intervention comme terminée
    @PutMapping("/intervention/{id}/complete")
    @PreAuthorize("hasAuthority('ROLE_ARTISAN')")
    public ResponseEntity<?> completeIntervention(@PathVariable Long id, HttpServletRequest request) {
        try {
            String token = request.getHeader("Authorization").replace("Bearer ", "");
            String email = jwtUtil.extractUsername(token);
            Optional<User> userOpt = userRepository.findByEmail(email);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(401).body(Map.of("error", "Utilisateur non trouvé"));
            }

            Optional<Intervention> interventionOpt = interventionRepository.findById(id);
            if (interventionOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Intervention intervention = interventionOpt.get();
            
            // Vérifier que l'intervention appartient bien à l'artisan
            if (!intervention.getArtisan().getEmail().equals(email)) {
                return ResponseEntity.status(403).body(Map.of("error", "Non autorisé"));
            }

            // Marquer comme terminée
            intervention.setStatus(com.fixyhome.model.ServiceStatus.COMPLETED);
            intervention.setCompletedAt(java.time.LocalDateTime.now());
            interventionRepository.save(intervention);

            return ResponseEntity.ok(Map.of(
                "message", "Intervention marquée comme terminée",
                "interventionId", intervention.getId()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Erreur: " + e.getMessage()));
        }
    }
}
