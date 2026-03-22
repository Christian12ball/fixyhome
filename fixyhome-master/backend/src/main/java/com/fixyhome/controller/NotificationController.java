package com.fixyhome.controller;

import com.fixyhome.model.Notification;
import com.fixyhome.service.NotificationService;
import com.fixyhome.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/notifications", "/notifications"})
@CrossOrigin(origins = "*", allowCredentials = "false")
public class NotificationController {
    
    private final NotificationService notificationService;
    private final JwtUtil jwtUtil;
    
    public NotificationController(NotificationService notificationService, JwtUtil jwtUtil) {
        this.notificationService = notificationService;
        this.jwtUtil = jwtUtil;
    }
    
    @GetMapping("/client")
    @PreAuthorize("hasAuthority('ROLE_CLIENT')")
    public ResponseEntity<List<Notification>> getClientNotifications(HttpServletRequest request) {
        String token = extractToken(request);
        String email = jwtUtil.extractUsername(token);
        
        List<Notification> notifications = notificationService.getClientNotifications(email);
        return ResponseEntity.ok(notifications);
    }
    
    @GetMapping("/artisan")
    @PreAuthorize("hasAuthority('ROLE_ARTISAN')")
    public ResponseEntity<List<Notification>> getArtisanNotifications(HttpServletRequest request) {
        String token = extractToken(request);
        String email = jwtUtil.extractUsername(token);
        
        List<Notification> notifications = notificationService.getArtisanNotifications(email);
        return ResponseEntity.ok(notifications);
    }
    
    @PutMapping("/{id}/read")
    @PreAuthorize("hasAuthority('ROLE_CLIENT') or hasAuthority('ROLE_ARTISAN')")
    public ResponseEntity<Void> markNotificationAsRead(@PathVariable Long id, HttpServletRequest request) {
        String token = extractToken(request);
        String email = jwtUtil.extractUsername(token);
        
        notificationService.markAsRead(id, email);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/create")
    public ResponseEntity<Notification> createNotification(@RequestBody Notification notification) {
        Notification created = notificationService.createNotification(notification);
        return ResponseEntity.status(201).body(created);
    }
    
    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
