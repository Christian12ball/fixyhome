package com.fixyhome.service;

import com.fixyhome.model.ServiceCategory;
import com.fixyhome.model.ServiceRequest;
import com.fixyhome.model.User;
import com.fixyhome.repository.ServiceRequestRepository;
import com.fixyhome.repository.UserRepository;
import com.fixyhome.repository.ServiceCategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ServiceRequestService {
    
    private final ServiceRequestRepository serviceRequestRepository;
    private final UserRepository userRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;
    
    public ServiceRequestService(ServiceRequestRepository serviceRequestRepository, UserRepository userRepository, ServiceCategoryRepository serviceCategoryRepository) {
        this.serviceRequestRepository = serviceRequestRepository;
        this.userRepository = userRepository;
        this.serviceCategoryRepository = serviceCategoryRepository;
    }
    
    public List<ServiceRequest> getServiceRequestsForUser(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        if (user.getUserType().name().equals("CLIENT")) {
            return serviceRequestRepository.findByClientId(user.getId());
        } else {
            return serviceRequestRepository.findByArtisanId(user.getId());
        }
    }
    
    public List<ServiceRequest> getPublicRequests() {
        return serviceRequestRepository.findAll();
    }
    
    public ServiceRequest createServiceRequest(ServiceRequest serviceRequest, String clientEmail) {
        User client = userRepository.findByEmail(clientEmail)
            .orElseThrow(() -> new RuntimeException("Client non trouvé"));
        
        serviceRequest.setClient(client);
        return serviceRequestRepository.save(serviceRequest);
    }
    
    public ServiceRequest updateServiceRequest(Long id, ServiceRequest updates, String email) {
        ServiceRequest existing = serviceRequestRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Demande de service non trouvée"));
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        // Vérifier les permissions
        if (!existing.getClient().getId().equals(user.getId()) && 
            !existing.getArtisan().getId().equals(user.getId())) {
            throw new RuntimeException("Non autorisé à modifier cette demande");
        }
        
        // Mettre à jour les champs autorisés
        if (updates.getTitle() != null) existing.setTitle(updates.getTitle());
        if (updates.getDescription() != null) existing.setDescription(updates.getDescription());
        if (updates.getStatus() != null) existing.setStatus(updates.getStatus());
        if (updates.getArtisan() != null) existing.setArtisan(updates.getArtisan());
        
        return serviceRequestRepository.save(existing);
    }
    
    public ServiceRequest getServiceRequestById(Long id) {
        return serviceRequestRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Demande de service non trouvée"));
    }
    
    public List<ServiceRequest> getPendingRequests(String category) {
        if (category != null && !category.isEmpty()) {
            Optional<ServiceCategory> catOpt = serviceCategoryRepository.findByName(category);
            if (catOpt.isPresent()) {
                ServiceCategory cat = catOpt.get();
                return serviceRequestRepository.findByStatusAndCategoryId(com.fixyhome.model.ServiceStatus.PENDING, cat.getId());
            } else {
                throw new RuntimeException("Catégorie invalide: " + category);
            }
        }
        return serviceRequestRepository.findByStatus(com.fixyhome.model.ServiceStatus.PENDING);
    }
    
    public ServiceRequest acceptRequest(Long requestId, String artisanEmail) {
        ServiceRequest request = serviceRequestRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Demande de service non trouvée"));
        
        User artisan = userRepository.findByEmail(artisanEmail)
            .orElseThrow(() -> new RuntimeException("Artisan non trouvé"));
        
        // Vérifier que la demande est en attente
        if (!request.getStatus().equals(com.fixyhome.model.ServiceStatus.PENDING)) {
            throw new RuntimeException("Cette demande n'est plus disponible");
        }
        
        // Assigner l'artisan et changer le statut
        request.setArtisan(artisan);
        request.setStatus(com.fixyhome.model.ServiceStatus.ACCEPTED);
        
        return serviceRequestRepository.save(request);
    }
    
    public ServiceRequest updateRequestStatus(Long requestId, String newStatus, String artisanEmail) {
        ServiceRequest request = serviceRequestRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Demande de service non trouvée"));
        
        User artisan = userRepository.findByEmail(artisanEmail)
            .orElseThrow(() -> new RuntimeException("Artisan non trouvé"));
        
        // Vérifier que l'artisan est bien assigné à cette demande
        if (request.getArtisan() == null || !request.getArtisan().getId().equals(artisan.getId())) {
            throw new RuntimeException("Vous n'êtes pas assigné à cette demande");
        }
        
        // Valider et mettre à jour le statut
        try {
            com.fixyhome.model.ServiceStatus status = com.fixyhome.model.ServiceStatus.valueOf(newStatus.toUpperCase());
            
            // Vérifier la progression des statuts
            if (request.getStatus() == com.fixyhome.model.ServiceStatus.ACCEPTED && status != com.fixyhome.model.ServiceStatus.IN_PROGRESS) {
                throw new RuntimeException("Une demande acceptée doit passer en 'EN COURS' avant d'être terminée");
            }
            if (request.getStatus() == com.fixyhome.model.ServiceStatus.IN_PROGRESS && status != com.fixyhome.model.ServiceStatus.COMPLETED) {
                throw new RuntimeException("Une demande en cours ne peut que être terminée");
            }
            if (request.getStatus() == com.fixyhome.model.ServiceStatus.COMPLETED) {
                throw new RuntimeException("Cette demande est déjà terminée");
            }
            
            request.setStatus(status);
            return serviceRequestRepository.save(request);
            
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Statut invalide: " + newStatus);
        }
    }
}
