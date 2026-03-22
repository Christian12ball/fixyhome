package com.fixyhome.controller;

import com.fixyhome.model.Intervention;
import com.fixyhome.model.ServiceStatus;
import com.fixyhome.service.InterventionService;
import com.fixyhome.service.NotificationService;
import com.fixyhome.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/interventions", "/api/interventions"})
@CrossOrigin(origins = "http://localhost:3000")
public class InterventionController {
    
    private static final Logger logger = LoggerFactory.getLogger(InterventionController.class);
    
    private final InterventionService interventionService;
    private final JwtUtil jwtUtil;
    private final NotificationService notificationService;
    
    public InterventionController(InterventionService interventionService, JwtUtil jwtUtil, NotificationService notificationService) {
        this.interventionService = interventionService;
        this.jwtUtil = jwtUtil;
        this.notificationService = notificationService;
    }
    
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ARTISAN')")
    public ResponseEntity<?> getInterventions(HttpServletRequest request) {
        String token = extractToken(request);
        String email = jwtUtil.extractUsername(token);
        
        List<Intervention> interventions = interventionService.getInterventionsByArtisan(email);
        return ResponseEntity.ok(interventions);
    }
    
    @GetMapping("/stats")
    @PreAuthorize("hasAuthority('ROLE_ARTISAN')")
    public ResponseEntity<?> getInterventionStats(HttpServletRequest request) {
        String token = extractToken(request);
        String email = jwtUtil.extractUsername(token);
        
        InterventionService.InterventionStats stats = interventionService.getInterventionStats(email);
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/status/{status}")
    @PreAuthorize("hasAuthority('ROLE_ARTISAN')")
    public ResponseEntity<?> getInterventionsByStatus(
            @PathVariable String status, 
            HttpServletRequest request) {
        String token = extractToken(request);
        String email = jwtUtil.extractUsername(token);
        
        try {
            ServiceStatus serviceStatus = ServiceStatus.valueOf(status.toUpperCase());
            List<Intervention> interventions = interventionService.getInterventionsByArtisanAndStatus(email, serviceStatus);
            return ResponseEntity.ok(interventions);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Statut invalide: " + status);
        }
    }
    
    @GetMapping("/search")
    @PreAuthorize("hasAuthority('ROLE_ARTISAN')")
    public ResponseEntity<?> searchInterventions(
            @RequestParam String term, 
            HttpServletRequest request) {
        String token = extractToken(request);
        String email = jwtUtil.extractUsername(token);
        
        List<Intervention> interventions = interventionService.searchInterventionsByArtisan(email, term);
        return ResponseEntity.ok(interventions);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ARTISAN') or hasAuthority('ROLE_CLIENT')")
    public ResponseEntity<?> getIntervention(@PathVariable Long id, HttpServletRequest request) {
        String token = extractToken(request);
        String email = jwtUtil.extractUsername(token);
        
        try {
            Intervention intervention = interventionService.getInterventionById(id);
            
            // Vérifier que l'utilisateur a le droit de voir cette intervention
            if (!intervention.getArtisan().getEmail().equals(email) && 
                !intervention.getClient().getEmail().equals(email)) {
                return ResponseEntity.status(403).body("Accès non autorisé à cette intervention");
            }
            
            return ResponseEntity.ok(intervention);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/from-request/{serviceRequestId}")
    @PreAuthorize("hasAuthority('ROLE_ARTISAN')")
    public ResponseEntity<?> createInterventionFromRequest(
            @PathVariable Long serviceRequestId, 
            HttpServletRequest request) {
        String token = extractToken(request);
        String email = jwtUtil.extractUsername(token);
        
        try {
            Intervention intervention = interventionService.createIntervention(serviceRequestId, email);
            return ResponseEntity.status(201).body(intervention);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_ARTISAN')")
    public ResponseEntity<?> updateInterventionStatus(
            @PathVariable Long id, 
            @RequestBody Map<String, String> statusUpdate,
            HttpServletRequest request) {
        String token = extractToken(request);
        String email = jwtUtil.extractUsername(token);
        
        try {
            String newStatus = statusUpdate.get("status");
            Intervention updated = interventionService.updateInterventionStatus(id, newStatus, email);
            
            // Envoyer une notification au client si le travail est marqué comme terminé
            if ("COMPLETED".equals(newStatus)) {
                try {
                    String artisanName = updated.getArtisan().getFirstName() + " " + updated.getArtisan().getLastName();
                    String serviceTitle = updated.getServiceRequest().getTitle();
                    
                    notificationService.createInterventionCompletedNotification(
                        updated.getClient().getEmail(),
                        artisanName,
                        serviceTitle
                    );
                    
                    logger.info("Notification de completion envoyée au client pour l'intervention {}", id);
                } catch (Exception e) {
                    logger.warn("Impossible d'envoyer la notification de completion pour l'intervention {}: {}", id, e.getMessage());
                    // Ne pas échouer la requête si la notification ne peut pas être envoyée
                }
            }
            
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ARTISAN')")
    public ResponseEntity<?> updateIntervention(
            @PathVariable Long id, 
            @Valid @RequestBody Intervention updates,
            HttpServletRequest request) {
        String token = extractToken(request);
        String email = jwtUtil.extractUsername(token);
        
        try {
            Intervention existing = interventionService.getInterventionById(id);
            
            // Vérifier que l'artisan est bien assigné à cette intervention
            if (!existing.getArtisan().getEmail().equals(email)) {
                return ResponseEntity.status(403).body("Vous n'êtes pas assigné à cette intervention");
            }
            
            Intervention updated = interventionService.updateIntervention(id, updates);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PostMapping("/{id}/feedback")
    @PreAuthorize("hasAuthority('ROLE_CLIENT')")
    public ResponseEntity<?> addClientFeedback(
            @PathVariable Long id,
            @RequestBody Map<String, Object> feedback,
            HttpServletRequest request) {
        String token = extractToken(request);
        String email = jwtUtil.extractUsername(token);
        
        try {
            Intervention intervention = interventionService.getInterventionById(id);
            
            // Vérifier que le client est bien le client de cette intervention
            if (!intervention.getClient().getEmail().equals(email)) {
                return ResponseEntity.status(403).body("Vous n'êtes pas le client de cette intervention");
            }
            
            Integer rating = (Integer) feedback.get("rating");
            String feedbackText = (String) feedback.get("feedback");
            
            Intervention updated = interventionService.addClientFeedback(id, rating, feedbackText);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/client")
    @PreAuthorize("hasAuthority('ROLE_CLIENT')")
    public ResponseEntity<?> getClientInterventions(HttpServletRequest request) {
        String token = extractToken(request);
        String email = jwtUtil.extractUsername(token);
        
        List<Intervention> interventions = interventionService.getInterventionsByClient(email);
        return ResponseEntity.ok(interventions);
    }
    
    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
