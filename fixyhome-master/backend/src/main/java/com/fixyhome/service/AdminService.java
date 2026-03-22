package com.fixyhome.service;

import com.fixyhome.model.*;
import com.fixyhome.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminService {
    
    private final UserRepository userRepository;
    private final ServiceRequestRepository serviceRequestRepository;
    private final InterventionRepository interventionRepository;
    private final ReviewRepository reviewRepository;
    private final ArtisanRepository artisanRepository;
    
    public AdminService(UserRepository userRepository, 
                       ServiceRequestRepository serviceRequestRepository,
                       InterventionRepository interventionRepository,
                       ReviewRepository reviewRepository,
                       ArtisanRepository artisanRepository) {
        this.userRepository = userRepository;
        this.serviceRequestRepository = serviceRequestRepository;
        this.interventionRepository = interventionRepository;
        this.reviewRepository = reviewRepository;
        this.artisanRepository = artisanRepository;
    }
    
    // Statistiques générales
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Statistiques utilisateurs
        long totalUsers = userRepository.count();
        long totalClients = userRepository.countByUserType(UserType.CLIENT);
        long totalArtisans = userRepository.countByUserType(UserType.ARTISAN);
        long totalAdmins = userRepository.countByUserType(UserType.ADMIN);
        
        stats.put("totalUsers", totalUsers);
        stats.put("totalClients", totalClients);
        stats.put("totalArtisans", totalArtisans);
        stats.put("totalAdmins", totalAdmins);
        
        // Statistiques demandes de service
        long totalServiceRequests = serviceRequestRepository.count();
        long pendingRequests = serviceRequestRepository.countByStatus(ServiceStatus.PENDING);
        long acceptedRequests = serviceRequestRepository.countByStatus(ServiceStatus.ACCEPTED);
        long inProgressRequests = serviceRequestRepository.countByStatus(ServiceStatus.IN_PROGRESS);
        long completedRequests = serviceRequestRepository.countByStatus(ServiceStatus.COMPLETED);
        
        stats.put("totalServiceRequests", totalServiceRequests);
        stats.put("pendingRequests", pendingRequests);
        stats.put("acceptedRequests", acceptedRequests);
        stats.put("inProgressRequests", inProgressRequests);
        stats.put("completedRequests", completedRequests);
        
        // Statistiques interventions
        long totalInterventions = interventionRepository.count();
        long completedInterventions = interventionRepository.countByStatus(ServiceStatus.COMPLETED);
        
        stats.put("totalInterventions", totalInterventions);
        stats.put("completedInterventions", completedInterventions);
        
        // Statistiques avis
        long totalReviews = reviewRepository.count();
        Double averageRating = reviewRepository.findAverageRating();
        
        stats.put("totalReviews", totalReviews);
        stats.put("averageRating", averageRating != null ? averageRating : 0.0);
        
        // Statistiques artisans vérifiés
        long verifiedArtisans = artisanRepository.countByIsVerifiedTrue();
        
        stats.put("verifiedArtisans", verifiedArtisans);
        
        return stats;
    }
    
    // Liste des utilisateurs récents
    public List<User> getRecentUsers(int limit) {
        return userRepository.findTop10ByOrderByCreatedAtDesc();
    }
    
    // Liste des demandes récentes
    public List<ServiceRequest> getRecentServiceRequests(int limit) {
        return serviceRequestRepository.findTop10ByOrderByCreatedAtDesc();
    }
    
    // Liste des interventions récentes
    public List<Intervention> getRecentInterventions(int limit) {
        return interventionRepository.findTop10ByOrderByCreatedAtDesc();
    }
    
    // Liste des artisans par catégorie
    public Map<String, Long> getArtisansByCategory() {
        List<Object[]> results = artisanRepository.countArtisansByCategory();
        return results.stream()
            .collect(Collectors.toMap(
                result -> ((ServiceCategory) result[0]).toString(),
                result -> (Long) result[1]
            ));
    }
    
    // Évolution des demandes par mois
    public Map<String, Long> getServiceRequestsByMonth() {
        List<Object[]> results = serviceRequestRepository.countServiceRequestsByMonth();
        return results.stream()
            .collect(Collectors.toMap(
                result -> (String) result[0],
                result -> (Long) result[1]
            ));
    }
    
    // Top artisans par revenus
    public List<Map<String, Object>> getTopArtisansByRevenue(int limit) {
        List<Object[]> results = interventionRepository.findTopArtisansByRevenue();
        return results.stream()
            .limit(limit)
            .map(result -> {
                Map<String, Object> artisan = new HashMap<>();
                artisan.put("id", result[0]);
                artisan.put("firstName", result[1]);
                artisan.put("lastName", result[2]);
                artisan.put("email", result[3]);
                artisan.put("totalRevenue", result[4]);
                artisan.put("completedInterventions", result[5]);
                return artisan;
            })
            .collect(Collectors.toList());
    }
    
    // Gestion des utilisateurs
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
    
    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            user.setFirstName(userDetails.getFirstName());
            user.setLastName(userDetails.getLastName());
            user.setPhone(userDetails.getPhone());
            user.setUserType(userDetails.getUserType());
            return userRepository.save(user);
        }
        return null;
    }
    
    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    // Gestion des artisans
    public List<Artisan> getAllArtisans() {
        return artisanRepository.findAll();
    }
    
    public Artisan updateArtisanVerification(Long artisanId, boolean verified) {
        Artisan artisan = artisanRepository.findById(artisanId).orElse(null);
        if (artisan != null) {
            artisan.setIsVerified(verified);
            return artisanRepository.save(artisan);
        }
        return null;
    }
    
    // Gestion des demandes de service
    public List<ServiceRequest> getAllServiceRequests() {
        return serviceRequestRepository.findAll();
    }
    
    public ServiceRequest updateServiceRequestStatus(Long id, ServiceStatus status) {
        ServiceRequest request = serviceRequestRepository.findById(id).orElse(null);
        if (request != null) {
            request.setStatus(status);
            return serviceRequestRepository.save(request);
        }
        return null;
    }
    
    public boolean deleteServiceRequest(Long id) {
        if (serviceRequestRepository.existsById(id)) {
            serviceRequestRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    // Gestion des interventions
    public List<Intervention> getAllInterventions() {
        return interventionRepository.findAll();
    }
    
    public Intervention updateInterventionStatus(Long id, ServiceStatus status) {
        Intervention intervention = interventionRepository.findById(id).orElse(null);
        if (intervention != null) {
            intervention.setStatus(status);
            return interventionRepository.save(intervention);
        }
        return null;
    }
    
    // Gestion des avis
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }
    
    public boolean deleteReview(Long id) {
        if (reviewRepository.existsById(id)) {
            reviewRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
