package com.fixyhome.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class FarotyWalletService {
    
    private static final Logger logger = LoggerFactory.getLogger(FarotyWalletService.class);
    
    @Value("${faroty.api.base-url:https://api-pay-prod.faroty.me}")
    private String baseUrl;
    
    @Value("${faroty.api.account-id:816ac7c4-f55d-4c90-9772-92ca78e2ab17}")
    private String accountId;
    
    @Value("${faroty.api.public-key:fk_live_mhZG1htEBgK02jvI5QZqNYTpzgdfFmMCisI8cho4KbxqSD9uq2l6h39XppRSayQVTtAj5pCAjRU}")
    private String publicKey;
    
    @Value("${faroty.api.legal-identifier:5bdf3222-fea0-4938-82a1-df2955516f25}")
    private String legalIdentifier;
    
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    public FarotyWalletService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }
    
    public String createWallet(String userId) {
        try {
            String url = baseUrl + "/payments/api/v1/wallets";
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("accountId", accountId);
            requestBody.put("currencyCode", "XAF");
            requestBody.put("walletType", "PERSONAL");
            requestBody.put("legalIdentifier", legalIdentifier);
            requestBody.put("refId", userId);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            
            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode responseJson = objectMapper.readTree(response.getBody());
                if (responseJson.has("data") && responseJson.get("data").has("walletId")) {
                    String walletId = responseJson.get("data").get("walletId").asText();
                    logger.info("Wallet créé avec succès pour l'utilisateur {}: {}", userId, walletId);
                    return walletId;
                }
            }
            
            logger.error("Erreur lors de la création du wallet pour l'utilisateur {}: {}", userId, response.getBody());
            throw new RuntimeException("Échec de la création du wallet");
            
        } catch (Exception e) {
            logger.error("Exception lors de la création du wallet pour l'utilisateur {}: {}", userId, e.getMessage(), e);
            throw new RuntimeException("Échec de la création du wallet: " + e.getMessage());
        }
    }
    
    public Map<String, Object> createPaymentSession(String walletId, int amount, String cancelUrl, String successUrl, 
                                                   String title, String description, String imageUrl) {
        try {
            String url = baseUrl + "/payments/api/v1/payment-sessions";
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("walletId", walletId);
            requestBody.put("currencyCode", "XAF");
            requestBody.put("cancelUrl", cancelUrl);
            requestBody.put("successUrl", successUrl);
            requestBody.put("type", "DEPOSIT");
            requestBody.put("amount", amount);
            requestBody.put("contentType", "CAMPAIGN_SIMPLE");
            
            Map<String, Object> dynamicContent = new HashMap<>();
            dynamicContent.put("title", title);
            dynamicContent.put("description", description);
            dynamicContent.put("target", amount + " XAF");
            if (imageUrl != null && !imageUrl.isEmpty()) {
                dynamicContent.put("imageUrl", imageUrl);
            }
            requestBody.put("dynamicContentData", dynamicContent);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-API-KEY", publicKey);
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            
            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode responseJson = objectMapper.readTree(response.getBody());
                if (responseJson.has("data")) {
                    JsonNode data = responseJson.get("data");
                    Map<String, Object> result = new HashMap<>();
                    result.put("sessionToken", data.get("sessionToken").asText());
                    result.put("sessionUrl", data.get("sessionUrl").asText());
                    
                    logger.info("Session de paiement créée avec succès pour le wallet {}: {}", walletId, result.get("sessionUrl"));
                    return result;
                }
            }
            
            logger.error("Erreur lors de la création de la session de paiement pour le wallet {}: {}", walletId, response.getBody());
            throw new RuntimeException("Échec de la création de la session de paiement");
            
        } catch (Exception e) {
            logger.error("Exception lors de la création de la session de paiement pour le wallet {}: {}", walletId, e.getMessage(), e);
            throw new RuntimeException("Échec de la création de la session de paiement: " + e.getMessage());
        }
    }
    
    public boolean verifyWebhookSignature(String payload, String signature, String secret) {
        // Implémentation de la vérification de signature webhook
        // Selon la documentation Faroty, il faut vérifier l'authenticité des données
        // Pour l'instant, nous retournons true, mais il faudrait implémenter la vérification HMAC
        logger.info("Vérification de la signature webhook (implémentation de base)");
        return true; // À améliorer avec la vraie vérification HMAC
    }
}
