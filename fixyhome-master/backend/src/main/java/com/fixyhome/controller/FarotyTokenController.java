package com.fixyhome.controller;

import com.fixyhome.model.Intervention;
import com.fixyhome.model.User;
import com.fixyhome.repository.InterventionRepository;
import com.fixyhome.repository.UserRepository;
import com.fixyhome.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/faroty")
@CrossOrigin(origins = "*")
public class FarotyTokenController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InterventionRepository interventionRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${frontend.url:http://localhost:3000}")
    private String frontendUrl;

    // Configuration Faroty
    private static final String FAROTY_AUTH_BASE_URL = "https://api-prod.faroty.me/auth/api/auth";
    private static final String FAROTY_PAY_BASE_URL = "https://api-pay-prod.faroty.me/payments/api/v1";
    private static final String ACCOUNT_ID = "816ac7c4-f55d-4c90-9772-92ca78e2ab17";
    private static final String API_KEY = "fk_live_mhZG1htEBgK02jvI5QZqNYTpzgdfFmMCisI8cho4KbxqSD9uq2l6h39XppRSayQVTtAj5pCAjRU";

    @PostMapping("/get-payment-token")
    @PreAuthorize("hasAuthority('ROLE_CLIENT')")
    public ResponseEntity<?> getPaymentToken(@RequestBody Map<String, Object> request, HttpServletRequest httpRequest) {
        try {
            // Extraire et valider le token utilisateur
            String userToken = httpRequest.getHeader("Authorization").replace("Bearer ", "");
            String userEmail = jwtUtil.extractUsername(userToken);
            
            // Valider que l'utilisateur existe et est un client
            Optional<User> userOpt = userRepository.findByEmail(userEmail);
            if (userOpt.isEmpty() || userOpt.get().getUserType() != com.fixyhome.model.UserType.CLIENT) {
                return ResponseEntity.status(403).body(Map.of("error", "Utilisateur non autorisé"));
            }

            User user = userOpt.get();
            
            // Valider les paramètres
            Long interventionId = ((Number) request.get("interventionId")).longValue();
            Double amount = ((Number) request.get("amount")).doubleValue();

            // Vérifier que l'intervention appartient bien à ce client
            Optional<Intervention> interventionOpt = interventionRepository.findById(interventionId);
            if (interventionOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Intervention intervention = interventionOpt.get();
            if (!intervention.getClient().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body(Map.of("error", "Intervention non autorisée"));
            }

            // Vérifier que l'intervention est terminée mais non payée
            if (!"COMPLETED".equals(intervention.getStatus()) || "COMPLETED".equals(intervention.getPaymentStatus())) {
                return ResponseEntity.status(400).body(Map.of("error", "Intervention non éligible au paiement"));
            }

            // Générer les informations de device pour Faroty
            Map<String, Object> deviceInfo = Map.of(
                "deviceId", "device-" + UUID.randomUUID().toString().substring(0, 8),
                "deviceType", "WEB",
                "deviceModel", "FixyHome Web App",
                "osName", "Web Browser"
            );

            // 1. Login Faroty avec l'email du client
            Map<String, Object> loginRequest = Map.of(
                "contact", user.getEmail(),
                "deviceInfo", deviceInfo
            );

            ResponseEntity<Map> loginResponse = restTemplate.postForEntity(
                FAROTY_AUTH_BASE_URL + "/login",
                loginRequest,
                Map.class
            );

            if (!loginResponse.getStatusCode().is2xxSuccessful()) {
                return ResponseEntity.status(500).body(Map.of("error", "Erreur lors du login Faroty"));
            }

            Map<String, Object> loginData = loginResponse.getBody();
            String tempToken = (String) loginData.get("tempToken");

            // 2. Créer le wallet Faroty (ou récupérer le wallet existant)
            String legalIdentifier = UUID.randomUUID().toString();
            String refId = UUID.randomUUID().toString();

            Map<String, Object> walletRequest = Map.of(
                "accountId", ACCOUNT_ID,
                "currencyCode", "XAF",
                "walletType", "PERSONAL",
                "legalIdentifier", legalIdentifier,
                "refId", refId
            );

            ResponseEntity<Map> walletResponse = restTemplate.postForEntity(
                FAROTY_PAY_BASE_URL + "/wallets",
                walletRequest,
                Map.class
            );

            if (!walletResponse.getStatusCode().is2xxSuccessful()) {
                return ResponseEntity.status(500).body(Map.of("error", "Erreur lors de la création du wallet"));
            }

            Map<String, Object> walletData = walletResponse.getBody();
            String walletId = (String) ((Map<String, Object>) walletData.get("data")).get("walletId");

            // 3. Créer la session de paiement
            String cancelUrl = frontendUrl + "/dashboard/client/interventions";
            String successUrl = frontendUrl + "/payment/success?interventionId=" + interventionId;

            Map<String, Object> paymentRequest = Map.of(
                "walletId", walletId,
                "currencyCode", "XAF",
                "cancelUrl", cancelUrl,
                "successUrl", successUrl,
                "type", "DEPOSIT",
                "amount", amount,
                "contentType", "CAMPAIGN_SIMPLE",
                "dynamicContentData", Map.of(
                    "title", "Paiement FixyHome - Intervention #" + interventionId,
                    "description", "Paiement pour services d'artisan: " + intervention.getServiceRequest().getTitle(),
                    "target", amount + " XAF",
                    "imageUrl", "https://media.faroty.me/api/media/public/c3e256db-6c97-48a7-8e8d-f2ba1d568727.jpg"
                )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);
            headers.set("X-API-KEY", API_KEY);

            org.springframework.http.HttpEntity<Map<String, Object>> paymentEntity = new org.springframework.http.HttpEntity<>(paymentRequest, headers);

            ResponseEntity<Map> paymentResponse = restTemplate.exchange(
                FAROTY_PAY_BASE_URL + "/payment-sessions",
                org.springframework.http.HttpMethod.POST,
                paymentEntity,
                Map.class
            );

            if (!paymentResponse.getStatusCode().is2xxSuccessful()) {
                return ResponseEntity.status(500).body(Map.of("error", "Erreur lors de la création de la session de paiement"));
            }

            Map<String, Object> paymentData = paymentResponse.getBody();
            Map<String, Object> paymentSessionData = (Map<String, Object>) paymentData.get("data");
            String sessionToken = (String) paymentSessionData.get("sessionToken");
            String sessionUrl = (String) paymentSessionData.get("sessionUrl");

            // 4. Mettre à jour l'intervention avec les infos de paiement
            intervention.setPaymentSessionToken(sessionToken);
            intervention.setPaymentStatus("PENDING");
            interventionRepository.save(intervention);

            // 5. Générer un token Faroty temporaire pour le frontend
            String farotyToken = generateFarotyToken(user.getEmail(), sessionToken, walletId);

            // 6. Renvoyer les informations au frontend
            return ResponseEntity.ok(Map.of(
                "success", true,
                "farotyToken", farotyToken,
                "sessionUrl", sessionUrl,
                "walletId", walletId,
                "sessionToken", sessionToken,
                "amount", amount,
                "interventionId", interventionId
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Erreur serveur: " + e.getMessage()));
        }
    }

    /**
     * Génère un token temporaire pour les opérations Faroty
     * Ce token est différent du token utilisateur et n'est valable que pour le paiement
     */
    private String generateFarotyToken(String userEmail, String sessionToken, String walletId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "FAROTY_PAYMENT");
        claims.put("userEmail", userEmail);
        claims.put("sessionToken", sessionToken);
        claims.put("walletId", walletId);
        claims.put("issuedAt", System.currentTimeMillis());
        claims.put("expiresAt", System.currentTimeMillis() + (15 * 60 * 1000)); // 15 minutes

        return jwtUtil.generateToken(claims);
    }

    /**
     * Valide un token Faroty temporaire
     */
    @PostMapping("/validate-faroty-token")
    public ResponseEntity<?> validateFarotyToken(@RequestBody Map<String, String> request) {
        try {
            String farotyToken = request.get("farotyToken");
            
            if (farotyToken == null || farotyToken.trim().isEmpty()) {
                return ResponseEntity.status(400).body(Map.of("error", "Token Faroty manquant"));
            }

            // Extraire les claims du token
            String userEmail = jwtUtil.extractUsername(farotyToken);
            
            // Vérifier que c'est bien un token Faroty
            Map<String, Object> claims = jwtUtil.extractAllClaims(farotyToken);
            String tokenType = (String) claims.get("type");
            
            if (!"FAROTY_PAYMENT".equals(tokenType)) {
                return ResponseEntity.status(400).body(Map.of("error", "Type de token invalide"));
            }

            // Vérifier l'expiration
            Long expiresAt = ((Number) claims.get("expiresAt")).longValue();
            if (System.currentTimeMillis() > expiresAt) {
                return ResponseEntity.status(401).body(Map.of("error", "Token Faroty expiré"));
            }

            // Renvoyer les informations validées
            return ResponseEntity.ok(Map.of(
                "valid", true,
                "userEmail", userEmail,
                "sessionToken", claims.get("sessionToken"),
                "walletId", claims.get("walletId")
            ));

        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Token Faroty invalide"));
        }
    }

    /**
     * Endpoint pour vérifier le statut d'une session de paiement
     */
    @GetMapping("/payment-status/{sessionToken}")
    public ResponseEntity<?> getPaymentStatus(@PathVariable String sessionToken) {
        try {
            Optional<Intervention> interventionOpt = interventionRepository.findByPaymentSessionToken(sessionToken);
            
            if (interventionOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Intervention intervention = interventionOpt.get();
            
            return ResponseEntity.ok(Map.of(
                "paymentStatus", intervention.getPaymentStatus(),
                "interventionId", intervention.getId(),
                "amount", intervention.getServiceRequest().getBudget()
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Erreur lors de la vérification du statut"));
        }
    }
}
