package com.fixyhome.repository;

import com.fixyhome.model.Intervention;
import com.fixyhome.model.ServiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface InterventionRepository extends JpaRepository<Intervention, Long> {
    
    List<Intervention> findByArtisanId(Long artisanId);
    
    List<Intervention> findByClientId(Long clientId);
    
    List<Intervention> findByServiceRequestId(Long serviceRequestId);
    
    Optional<Intervention> findByServiceRequestIdAndArtisanId(Long serviceRequestId, Long artisanId);
    
    List<Intervention> findByStatus(ServiceStatus status);
    
    List<Intervention> findByArtisanIdAndStatus(Long artisanId, ServiceStatus status);
    
    List<Intervention> findByClientIdAndStatus(Long clientId, ServiceStatus status);
    
    @Query("SELECT i FROM Intervention i WHERE i.artisan.id = :artisanId AND i.status IN :statuses")
    List<Intervention> findByArtisanIdAndStatusIn(@Param("artisanId") Long artisanId, @Param("statuses") List<ServiceStatus> statuses);
    
    @Query("SELECT i FROM Intervention i WHERE i.startTime >= :startDate AND i.startTime <= :endDate")
    List<Intervention> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT i FROM Intervention i WHERE i.artisan.id = :artisanId AND i.startTime >= :startDate AND i.startTime <= :endDate")
    List<Intervention> findByArtisanIdAndDateRange(@Param("artisanId") Long artisanId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(i) FROM Intervention i WHERE i.artisan.id = :artisanId AND i.status = :status")
    long countByArtisanIdAndStatus(@Param("artisanId") Long artisanId, @Param("status") ServiceStatus status);
    
    @Query("SELECT AVG(i.clientRating) FROM Intervention i WHERE i.artisan.id = :artisanId AND i.clientRating IS NOT NULL")
    Double getAverageRatingByArtisanId(@Param("artisanId") Long artisanId);
    
    @Query("SELECT i FROM Intervention i WHERE i.status = 'COMPLETED' AND i.clientRating IS NULL")
    List<Intervention> findCompletedInterventionsWithoutRating();
    
    @Query("SELECT i FROM Intervention i WHERE i.artisan.id = :artisanId AND (i.serviceRequest.title LIKE %:search% OR i.notes LIKE %:search% OR i.client.firstName LIKE %:search% OR i.client.lastName LIKE %:search%)")
    List<Intervention> searchInterventionsByArtisan(@Param("artisanId") Long artisanId, @Param("search") String search);
    
    @Query("SELECT i FROM Intervention i WHERE i.client.id = :clientId AND (i.serviceRequest.title LIKE %:search% OR i.notes LIKE %:search% OR i.artisan.firstName LIKE %:search% OR i.artisan.lastName LIKE %:search%)")
    List<Intervention> searchInterventionsByClient(@Param("clientId") Long clientId, @Param("search") String search);
    
    @Query("SELECT COUNT(i) FROM Intervention i WHERE i.artisan.id = :artisanId AND i.status = 'IN_PROGRESS'")
    long countInProgressInterventionsByArtisan(@Param("artisanId") Long artisanId);
    
    @Query("SELECT COUNT(i) FROM Intervention i WHERE i.artisan.id = :artisanId AND i.status = 'COMPLETED'")
    long countCompletedInterventionsByArtisan(@Param("artisanId") Long artisanId);
    
    @Query("SELECT SUM(i.actualCost) FROM Intervention i WHERE i.artisan.id = :artisanId AND i.status = 'COMPLETED' AND i.actualCost IS NOT NULL")
    Integer getTotalEarningsByArtisan(@Param("artisanId") Long artisanId);
    
    @Query("SELECT i FROM Intervention i WHERE i.artisan.id = :artisanId ORDER BY i.createdAt DESC")
    List<Intervention> findByArtisanIdOrderByCreatedAtDesc(@Param("artisanId") Long artisanId);
    
    @Query("SELECT i FROM Intervention i WHERE i.artisan.id = :artisanId AND i.status = 'COMPLETED' ORDER BY i.endTime DESC")
    List<Intervention> findCompletedInterventionsByArtisanOrderByEndTimeDesc(@Param("artisanId") Long artisanId);
    
    List<Intervention> findTop10ByOrderByCreatedAtDesc();
    
    long countByStatus(ServiceStatus status);
    
    @Query("SELECT i.artisan.id, i.artisan.firstName, i.artisan.lastName, i.artisan.email, SUM(i.actualCost) as totalRevenue, COUNT(i) as completedInterventions " +
           "FROM Intervention i " +
           "WHERE i.status = 'COMPLETED' AND i.actualCost IS NOT NULL " +
           "GROUP BY i.artisan.id, i.artisan.firstName, i.artisan.lastName, i.artisan.email " +
           "ORDER BY totalRevenue DESC")
    List<Object[]> findTopArtisansByRevenue();
    
    Optional<Intervention> findByPaymentSessionToken(String paymentSessionToken);
}
