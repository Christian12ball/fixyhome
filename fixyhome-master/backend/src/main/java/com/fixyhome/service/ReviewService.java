package com.fixyhome.service;

import com.fixyhome.model.Review;
import com.fixyhome.model.ServiceStatus;
import com.fixyhome.model.User;
import com.fixyhome.repository.ReviewRepository;
import com.fixyhome.repository.ServiceRequestRepository;
import com.fixyhome.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReviewService {
    
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ServiceRequestRepository serviceRequestRepository;
    
    public ReviewService(ReviewRepository reviewRepository, UserRepository userRepository, 
                        ServiceRequestRepository serviceRequestRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.serviceRequestRepository = serviceRequestRepository;
    }
    
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }
    
    @Transactional
    public Review createReview(Review review, String clientEmail) {
        User client = userRepository.findByEmail(clientEmail)
            .orElseThrow(() -> new RuntimeException("Client non trouvé"));
        
        // Vérifier que la demande de service est complétée
        if (review.getServiceRequest().getStatus() != ServiceStatus.COMPLETED) {
            throw new RuntimeException("Impossible de laisser un avis pour un service non complété");
        }
        
        // Vérifier que le client est bien celui qui a fait la demande
        if (!review.getServiceRequest().getClient().getId().equals(client.getId())) {
            throw new RuntimeException("Non autorisé à laisser un avis pour cette demande");
        }
        
        review.setClient(client);
        Review savedReview = reviewRepository.save(review);
        
        // Mettre à jour la note moyenne de l'artisan
        updateArtisanRating(review.getArtisan().getId());
        
        return savedReview;
    }
    
    private void updateArtisanRating(Long artisanId) {
        Double avgRating = reviewRepository.getAverageRatingForArtisan(artisanId);
        Long reviewCount = reviewRepository.getReviewCountForArtisan(artisanId);
        
        // Mettre à jour dans la table artisans (si vous avez cette relation)
        // Cette partie dépend de votre structure exacte
    }
}
