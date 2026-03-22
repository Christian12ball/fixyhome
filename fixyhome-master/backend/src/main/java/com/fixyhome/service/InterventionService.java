package com.fixyhome.service;

import com.fixyhome.model.Intervention;
import com.fixyhome.model.ServiceRequest;
import com.fixyhome.model.ServiceStatus;
import com.fixyhome.model.User;
import com.fixyhome.repository.InterventionRepository;
import com.fixyhome.repository.ServiceRequestRepository;
import com.fixyhome.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class InterventionService {
    
    private final InterventionRepository interventionRepository;
    private final ServiceRequestRepository serviceRequestRepository;
    private final UserRepository userRepository;
    
    public InterventionService(InterventionRepository interventionRepository, 
                              ServiceRequestRepository serviceRequestRepository,
                              UserRepository userRepository) {
        this.interventionRepository = interventionRepository;
        this.serviceRequestRepository = serviceRequestRepository;
        this.userRepository = userRepository;
    }
    
    public Intervention createIntervention(Long serviceRequestId, String artisanEmail) {
        ServiceRequest serviceRequest = serviceRequestRepository.findById(serviceRequestId)
            .orElseThrow(() -> new RuntimeException("Demande de service non trouvée"));
        
        User artisan = userRepository.findByEmail(artisanEmail)
            .orElseThrow(() -> new RuntimeException("Artisan non trouvé"));
        
        // Vérifier que la demande est acceptée
        if (!ServiceStatus.ACCEPTED.equals(serviceRequest.getStatus())) {
            throw new RuntimeException("Cette demande n'est pas acceptée");
        }
        
        // Vérifier que l'artisan est bien assigné à la demande
        if (serviceRequest.getArtisan() == null || !serviceRequest.getArtisan().getId().equals(artisan.getId())) {
            throw new RuntimeException("Vous n'êtes pas assigné à cette demande");
        }
        
        // Vérifier qu'une intervention n'existe pas déjà
        Optional<Intervention> existingIntervention = interventionRepository
            .findByServiceRequestIdAndArtisanId(serviceRequestId, artisan.getId());
        if (existingIntervention.isPresent()) {
            return existingIntervention.get();
        }
        
        Intervention intervention = new Intervention(serviceRequest, artisan, serviceRequest.getClient());
        return interventionRepository.save(intervention);
    }
    
    public Intervention updateInterventionStatus(Long interventionId, String newStatus, String artisanEmail) {
        Intervention intervention = interventionRepository.findById(interventionId)
            .orElseThrow(() -> new RuntimeException("Intervention non trouvée"));
        
        User artisan = userRepository.findByEmail(artisanEmail)
            .orElseThrow(() -> new RuntimeException("Artisan non trouvé"));
        
        // Vérifier que l'artisan est bien assigné à cette intervention
        if (!intervention.getArtisan().getId().equals(artisan.getId())) {
            throw new RuntimeException("Vous n'êtes pas assigné à cette intervention");
        }
        
        ServiceStatus status;
        try {
            status = ServiceStatus.valueOf(newStatus.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Statut invalide: " + newStatus);
        }
        
        // Valider la progression des statuts
        validateStatusProgression(intervention.getStatus(), status);
        
        // Mettre à jour les temps
        if (ServiceStatus.IN_PROGRESS.equals(status) && intervention.getStartTime() == null) {
            intervention.setStartTime(LocalDateTime.now());
        }
        
        if (ServiceStatus.COMPLETED.equals(status) && intervention.getEndTime() == null) {
            intervention.setEndTime(LocalDateTime.now());
            // Mettre à jour le statut de la demande de service aussi
            intervention.getServiceRequest().setStatus(status);
            serviceRequestRepository.save(intervention.getServiceRequest());
        }
        
        intervention.setStatus(status);
        return interventionRepository.save(intervention);
    }
    
    public List<Intervention> getInterventionsByArtisan(String artisanEmail) {
        User artisan = userRepository.findByEmail(artisanEmail)
            .orElseThrow(() -> new RuntimeException("Artisan non trouvé"));
        
        return interventionRepository.findByArtisanIdOrderByCreatedAtDesc(artisan.getId());
    }
    
    public List<Intervention> getInterventionsByArtisanAndStatus(String artisanEmail, ServiceStatus status) {
        User artisan = userRepository.findByEmail(artisanEmail)
            .orElseThrow(() -> new RuntimeException("Artisan non trouvé"));
        
        return interventionRepository.findByArtisanIdAndStatus(artisan.getId(), status);
    }
    
    public List<Intervention> getInterventionsByClient(String clientEmail) {
        User client = userRepository.findByEmail(clientEmail)
            .orElseThrow(() -> new RuntimeException("Client non trouvé"));
        
        return interventionRepository.findByClientId(client.getId());
    }
    
    public Intervention getInterventionById(Long id) {
        return interventionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Intervention non trouvée"));
    }
    
    public Intervention updateIntervention(Long id, Intervention updates) {
        Intervention existing = interventionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Intervention non trouvée"));
        
        // Mettre à jour les champs autorisés
        if (updates.getNotes() != null) existing.setNotes(updates.getNotes());
        if (updates.getActualCost() != null) existing.setActualCost(updates.getActualCost());
        if (updates.getPhotos() != null) existing.setPhotos(updates.getPhotos());
        if (updates.getMaterialsUsed() != null) existing.setMaterialsUsed(updates.getMaterialsUsed());
        if (updates.getArtisanNotesInternal() != null) existing.setArtisanNotesInternal(updates.getArtisanNotesInternal());
        
        return interventionRepository.save(existing);
    }
    
    public Intervention addClientFeedback(Long id, Integer rating, String feedback) {
        Intervention intervention = interventionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Intervention non trouvée"));
        
        if (!ServiceStatus.COMPLETED.equals(intervention.getStatus())) {
            throw new RuntimeException("Seules les interventions terminées peuvent recevoir un avis");
        }
        
        intervention.setClientRating(rating);
        intervention.setClientFeedback(feedback);
        return interventionRepository.save(intervention);
    }
    
    public List<Intervention> searchInterventionsByArtisan(String artisanEmail, String searchTerm) {
        User artisan = userRepository.findByEmail(artisanEmail)
            .orElseThrow(() -> new RuntimeException("Artisan non trouvé"));
        
        return interventionRepository.searchInterventionsByArtisan(artisan.getId(), searchTerm);
    }
    
    public InterventionStats getInterventionStats(String artisanEmail) {
        User artisan = userRepository.findByEmail(artisanEmail)
            .orElseThrow(() -> new RuntimeException("Artisan non trouvé"));
        
        long total = interventionRepository.findByArtisanId(artisan.getId()).size();
        long accepted = interventionRepository.countByArtisanIdAndStatus(artisan.getId(), ServiceStatus.ACCEPTED);
        long inProgress = interventionRepository.countByArtisanIdAndStatus(artisan.getId(), ServiceStatus.IN_PROGRESS);
        long completed = interventionRepository.countByArtisanIdAndStatus(artisan.getId(), ServiceStatus.COMPLETED);
        
        return new InterventionStats(total, accepted, inProgress, completed);
    }
    
    private void validateStatusProgression(ServiceStatus currentStatus, ServiceStatus newStatus) {
        if (ServiceStatus.COMPLETED.equals(currentStatus)) {
            throw new RuntimeException("Cette intervention est déjà terminée");
        }
        
        if (ServiceStatus.ACCEPTED.equals(currentStatus) && !ServiceStatus.IN_PROGRESS.equals(newStatus)) {
            throw new RuntimeException("Une intervention acceptée doit passer en 'EN COURS' avant d'être terminée");
        }
        
        if (ServiceStatus.IN_PROGRESS.equals(currentStatus) && !ServiceStatus.COMPLETED.equals(newStatus)) {
            throw new RuntimeException("Une intervention en cours ne peut que être terminée");
        }
    }
    
    // Classe interne pour les statistiques
    public static class InterventionStats {
        private final long total;
        private final long accepted;
        private final long inProgress;
        private final long completed;
        
        public InterventionStats(long total, long accepted, long inProgress, long completed) {
            this.total = total;
            this.accepted = accepted;
            this.inProgress = inProgress;
            this.completed = completed;
        }
        
        public long getTotal() { return total; }
        public long getAccepted() { return accepted; }
        public long getInProgress() { return inProgress; }
        public long getCompleted() { return completed; }
    }
}
