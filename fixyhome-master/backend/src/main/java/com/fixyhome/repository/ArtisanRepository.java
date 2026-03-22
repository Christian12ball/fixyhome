package com.fixyhome.repository;

import com.fixyhome.model.Artisan;
import com.fixyhome.model.ServiceCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArtisanRepository extends JpaRepository<Artisan, Long> {
    
    List<Artisan> findByCategory(ServiceCategory category);
    
    List<Artisan> findByCategoryAndIsVerified(ServiceCategory category, Boolean isVerified);
    
    List<Artisan> findByCategoryIdAndIsVerified(Long categoryId, Boolean isVerified);
    
    List<Artisan> findByIsVerified(Boolean isVerified);
    
    List<Artisan> findByLocationContainingIgnoreCaseAndIsVerified(String location, Boolean isVerified);
    
    // Ajout de la méthode findByUserId manquante
    Optional<Artisan> findByUserId(Long userId);
    
    @Query("SELECT a FROM Artisan a WHERE a.category = :category AND a.isVerified = true")
    List<Artisan> findVerifiedArtisansByCategory(ServiceCategory category);
    
    @Query("SELECT a FROM Artisan a WHERE a.rating >= :minRating ORDER BY a.rating DESC")
    List<Artisan> findArtisansByMinRating(Double minRating);
    
    @Query("SELECT a FROM Artisan a WHERE a.category = :category AND a.rating >= :minRating ORDER BY a.rating DESC")
    List<Artisan> findArtisansByCategoryAndMinRating(ServiceCategory category, Double minRating);
    
    long countByIsVerifiedTrue();
    
    @Query("SELECT a.category, COUNT(a) FROM Artisan a GROUP BY a.category")
    List<Object[]> countArtisansByCategory();
}
