package com.fixyhome.service;

import com.fixyhome.model.Notification;
import com.fixyhome.model.NotificationType;
import com.fixyhome.model.User;
import com.fixyhome.repository.NotificationRepository;
import com.fixyhome.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class NotificationService {
    
    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);
    
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    
    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }
    
    public List<Notification> getClientNotifications(String email) {
        return notificationRepository.findByUserEmail(email);
    }
    
    public List<Notification> getArtisanNotifications(String email) {
        return notificationRepository.findByUserEmail(email);
    }
    
    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }
    
    public Notification createNotificationForUser(String userEmail, String message, NotificationType type) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé: " + userEmail));
        
        Notification notification = new Notification(user, message, type);
        return notificationRepository.save(notification);
    }
    
    public void markAsRead(Long notificationId, String userEmail) {
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new RuntimeException("Notification non trouvée: " + notificationId));
        
        // Vérifier que la notification appartient bien à l'utilisateur
        if (!notification.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Accès non autorisé à cette notification");
        }
        
        notification.setRead(true);
        notificationRepository.save(notification);
    }
    
    public void createInterventionAcceptedNotification(String clientEmail, String artisanName, String serviceTitle, LocalDateTime scheduledDate) {
        String message = String.format(
            "L'artisan %s a accepté votre demande pour le service \"%s\". " +
            "L'intervention est prévue pour le %s à %s.",
            artisanName,
            serviceTitle,
            scheduledDate.toLocalDate().format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy")),
            scheduledDate.toLocalTime().format(java.time.format.DateTimeFormatter.ofPattern("HH:mm"))
        );
        
        createNotificationForUser(clientEmail, message, NotificationType.SUCCESS);
        logger.info("Notification d'acceptation créée pour le client: {}", clientEmail);
    }
    
    public void createInterventionCompletedNotification(String clientEmail, String artisanName, String serviceTitle) {
        String message = String.format(
            "L'artisan %s a marqué le travail \"%s\" comme terminé. " +
            "Veuillez confirmer et procéder au paiement.",
            artisanName,
            serviceTitle
        );
        
        createNotificationForUser(clientEmail, message, NotificationType.INFO);
        logger.info("Notification de completion créée pour le client: {}", clientEmail);
    }
    
    public void createPaymentCompletedNotification(String artisanEmail, String clientName, String serviceTitle) {
        String message = String.format(
            "Le client %s a effectué le paiement pour le service \"%s\". " +
            "Le montant sera crédité sur votre compte.",
            clientName,
            serviceTitle
        );
        
        createNotificationForUser(artisanEmail, message, NotificationType.SUCCESS);
        logger.info("Notification de paiement créée pour l'artisan: {}", artisanEmail);
    }
}
