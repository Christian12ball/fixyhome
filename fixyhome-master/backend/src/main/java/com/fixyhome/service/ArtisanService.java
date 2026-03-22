package com.fixyhome.service;

import com.fixyhome.model.Artisan;
import com.fixyhome.model.Review;
import com.fixyhome.model.ServiceCategory;
import com.fixyhome.repository.ArtisanRepository;
import com.fixyhome.repository.ReviewRepository;
import com.fixyhome.repository.ServiceCategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ArtisanService {
    
    private final ArtisanRepository artisanRepository;
    private final ReviewRepository reviewRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;
    
    public ArtisanService(ArtisanRepository artisanRepository, ReviewRepository reviewRepository, ServiceCategoryRepository serviceCategoryRepository) {
        this.artisanRepository = artisanRepository;
        this.reviewRepository = reviewRepository;
        this.serviceCategoryRepository = serviceCategoryRepository;
    }
    
    public List<Artisan> getArtisans(String category, String location) {
        if (category != null && !category.isEmpty()) {
            Optional<ServiceCategory> catOpt = serviceCategoryRepository.findByName(category);
            if (catOpt.isPresent()) {
                ServiceCategory cat = catOpt.get();
                return artisanRepository.findByCategoryAndIsVerified(cat, true);
            } else {
                throw new RuntimeException("Catégorie invalide: " + category);
            }
        } else if (location != null && !location.isEmpty()) {
            return artisanRepository.findByLocationContainingIgnoreCaseAndIsVerified(location, true);
        } else {
            return artisanRepository.findByIsVerified(true);
        }
    }
    
    public Artisan getArtisanById(Long id) {
        return artisanRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Artisan non trouvé"));
    }
    
    public List<Review> getArtisanReviews(Long id) {
        return reviewRepository.findByArtisanId(id);
    }
}
