package com.fixyhome.controller;

import com.fixyhome.model.ServiceRequest;
import com.fixyhome.model.User;
import com.fixyhome.model.UserType;
import com.fixyhome.repository.UserRepository;
import com.fixyhome.security.JwtUtil;
import com.fixyhome.service.ServiceRequestService;
import com.fixyhome.service.InterventionService;
import com.fixyhome.service.NotificationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/services"})
@CrossOrigin(origins = "*", allowCredentials = "false")
public class ServiceRequestController {
    
    private static final Logger logger = LoggerFactory.getLogger(ServiceRequestController.class);
    
    private final ServiceRequestService serviceRequestService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final InterventionService interventionService;
    private final NotificationService notificationService;
    
    public ServiceRequestController(ServiceRequestService serviceRequestService, JwtUtil jwtUtil, UserRepository userRepository, InterventionService interventionService, NotificationService notificationService) {
        this.serviceRequestService = serviceRequestService;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.interventionService = interventionService;
        this.notificationService = notificationService;
    }
    
    @GetMapping("/requests")
    public ResponseEntity<List<ServiceRequest>> getServiceRequests(HttpServletRequest request) {
        String token = extractToken(request);
        String email = jwtUtil.extractUsername(token);
        
        List<ServiceRequest> requests = serviceRequestService.getServiceRequestsForUser(email);
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/pending")
    public ResponseEntity<List<ServiceRequest>> getPendingRequests(@RequestParam(required = false) String category) {
        System.out.println("Endpoint /pending appelé avec category: " + category);
        try {
            List<ServiceRequest> requests = serviceRequestService.getPendingRequests(category);
            System.out.println("Nombre de demandes trouvées: " + requests.size());
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            System.err.println("Erreur dans /pending: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
    
    @PutMapping("/requests/{id}/accept")
    @PreAuthorize("hasAuthority('ROLE_ARTISAN')")
    public ResponseEntity<ServiceRequest> acceptRequest(@PathVariable Long id, HttpServletRequest request) {
        String token = extractToken(request);
        String email = jwtUtil.extractUsername(token);
        
        ServiceRequest updated = serviceRequestService.acceptRequest(id, email);
        
        // Créer automatiquement une intervention
        try {
            interventionService.createIntervention(id, email);
            logger.info("Intervention créée automatiquement pour la demande {}", id);
            
            // Envoyer une notification au client
            User artisan = userRepository.findByEmail(email).orElse(null);
            if (artisan != null && updated.getClient() != null) {
                String artisanName = artisan.getFirstName() + " " + artisan.getLastName();
                
                // Créer une notification d'acceptation
                notificationService.createNotificationForUser(
                    updated.getClient().getEmail(),
                    String.format(
                        "L'artisan %s a accepté votre demande pour le service \"%s\". L'intervention sera planifiée prochainement.",
                        artisanName,
                        updated.getTitle()
                    ),
                    com.fixyhome.model.NotificationType.SUCCESS
                );
                
                logger.info("Notification d'acceptation envoyée au client pour la demande {}", id);
            }
        } catch (Exception e) {
            logger.warn("Impossible de créer l'intervention ou la notification pour la demande {}: {}", id, e.getMessage());
            // Ne pas échouer la requête si l'intervention ne peut pas être créée
        }
        
        return ResponseEntity.ok(updated);
    }
    
    @PutMapping("/requests/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_ARTISAN')")
    public ResponseEntity<ServiceRequest> updateRequestStatus(
            @PathVariable Long id, 
            @RequestBody Map<String, String> statusUpdate,
            HttpServletRequest request) {
        String token = extractToken(request);
        String email = jwtUtil.extractUsername(token);
        
        String newStatus = statusUpdate.get("status");
        ServiceRequest updated = serviceRequestService.updateRequestStatus(id, newStatus, email);
        return ResponseEntity.ok(updated);
    }
    
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Controller works!");
    }
    
    @PostMapping("/requests")
    @PreAuthorize("hasAuthority('ROLE_CLIENT')")
    public ResponseEntity<ServiceRequest> createServiceRequest(
            @Valid @RequestBody ServiceRequest serviceRequest, 
            HttpServletRequest request) {
        String token = extractToken(request);
        String email = jwtUtil.extractUsername(token);
        
        ServiceRequest created = serviceRequestService.createServiceRequest(serviceRequest, email);
        return ResponseEntity.status(201).body(created);
    }
    
    @GetMapping("/debug")
    public ResponseEntity<?> debugAuth(HttpServletRequest request) {
        logger.info("Debug auth endpoint appelé");
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            return ResponseEntity.ok(Map.of(
                "message", "Aucune authentification trouvée",
                "authenticated", false
            ));
        }
        
        String token = extractToken(request);
        Map<String, Object> debugInfo = new HashMap<>();
        debugInfo.put("authenticated", auth.isAuthenticated());
        debugInfo.put("username", auth.getName());
        debugInfo.put("authorities", auth.getAuthorities().stream().map(Object::toString).toList());
        debugInfo.put("tokenPresent", token != null);
        
        if (token != null) {
            try {
                String email = jwtUtil.extractUsername(token);
                debugInfo.put("emailFromToken", email);
                
                // Récupérer l'utilisateur depuis la base de données
                User user = userRepository.findByEmail(email).orElse(null);
                if (user != null) {
                    debugInfo.put("userType", user.getUserType().name());
                    debugInfo.put("userId", user.getId());
                } else {
                    debugInfo.put("userFound", false);
                }
            } catch (Exception e) {
                debugInfo.put("tokenError", e.getMessage());
            }
        }
        
        return ResponseEntity.ok(debugInfo);
    }
    
    @PutMapping("/services/requests/{id}")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ARTISAN')")
    public ResponseEntity<ServiceRequest> updateServiceRequest(
            @PathVariable Long id,
            @RequestBody ServiceRequest serviceRequest,
            HttpServletRequest request) {
        String token = extractToken(request);
        String email = jwtUtil.extractUsername(token);
        
        ServiceRequest updated = serviceRequestService.updateServiceRequest(id, serviceRequest, email);
        return ResponseEntity.ok(updated);
    }
    
    @GetMapping("/services/requests/{id}")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ARTISAN')")
    public ResponseEntity<ServiceRequest> getServiceRequest(@PathVariable Long id) {
        ServiceRequest serviceRequest = serviceRequestService.getServiceRequestById(id);
        return ResponseEntity.ok(serviceRequest);
    }
    
    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
