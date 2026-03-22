package com.fixyhome.repository;

import com.fixyhome.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    List<Review> findByArtisanId(Long artisanId);
    
    List<Review> findByClientId(Long clientId);
    
    List<Review> findByServiceRequestId(Long serviceRequestId);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.artisan.id = :artisanId")
    Double getAverageRatingForArtisan(Long artisanId);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.artisan.id = :artisanId")
    Long getReviewCountForArtisan(Long artisanId);
    
    @Query("SELECT AVG(r.rating) FROM Review r")
    Double findAverageRating();
}
