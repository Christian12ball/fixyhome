package com.fixyhome.repository;

import com.fixyhome.model.ServiceCategory;
import com.fixyhome.model.ServiceRequest;
import com.fixyhome.model.ServiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {
    
    List<ServiceRequest> findByClientId(Long clientId);
    
    List<ServiceRequest> findByArtisanId(Long artisanId);
    
    List<ServiceRequest> findByCategory(ServiceCategory category);
    
    List<ServiceRequest> findByStatus(ServiceStatus status);
    
    List<ServiceRequest> findByStatusAndCategory(ServiceStatus status, ServiceCategory category);
    
    List<ServiceRequest> findByStatusAndCategoryId(ServiceStatus status, Long categoryId);
    
    long countByStatus(ServiceStatus status);
    
    List<ServiceRequest> findTop10ByOrderByCreatedAtDesc();
    
    @Query("SELECT DATE_TRUNC('month', sr.createdAt) as month, COUNT(sr) as count " +
           "FROM ServiceRequest sr " +
           "GROUP BY DATE_TRUNC('month', sr.createdAt) " +
           "ORDER BY month DESC " +
           "LIMIT 12")
    List<Object[]> countServiceRequestsByMonth();
    
    @Query("SELECT sr FROM ServiceRequest sr WHERE sr.status = 'PENDING' AND sr.category = :category")
    List<ServiceRequest> findPendingRequestsByCategory(ServiceCategory category);
    
    @Query("SELECT sr FROM ServiceRequest sr WHERE sr.location LIKE %:location% AND sr.status = 'PENDING'")
    List<ServiceRequest> findPendingRequestsByLocation(String location);
}
