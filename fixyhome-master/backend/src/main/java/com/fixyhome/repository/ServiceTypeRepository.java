package com.fixyhome.repository;

import com.fixyhome.model.ServiceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceTypeRepository extends JpaRepository<ServiceType, Long> {
    
    @Query("SELECT st FROM ServiceType st WHERE st.isActive = true")
    List<ServiceType> findActiveServices();
    
    @Query("SELECT st FROM ServiceType st WHERE st.isActive = true AND st.category.name = :categoryName")
    List<ServiceType> findActiveServicesByCategory(@Param("categoryName") String categoryName);
    
    @Query("SELECT st FROM ServiceType st WHERE st.category.id = :categoryId AND st.isActive = true")
    List<ServiceType> findActiveServicesByCategoryId(@Param("categoryId") Integer categoryId);
    
    Optional<ServiceType> findByLabelAndIsActive(String label, Boolean isActive);
    
    @Query("SELECT COUNT(st) FROM ServiceType st WHERE st.isActive = true")
    long countActiveServices();
}
