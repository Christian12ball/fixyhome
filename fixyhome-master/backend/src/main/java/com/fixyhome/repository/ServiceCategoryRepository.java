package com.fixyhome.repository;

import com.fixyhome.model.ServiceCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceCategoryRepository extends JpaRepository<ServiceCategory, Long> {
    
    @Query("SELECT sc FROM ServiceCategory sc WHERE sc.isActive = true")
    List<ServiceCategory> findActiveCategories();
    
    Optional<ServiceCategory> findByNameAndIsActive(String name, Boolean isActive);
    
    Optional<ServiceCategory> findByLabelAndIsActive(String label, Boolean isActive);
    
    @Query("SELECT sc FROM ServiceCategory sc WHERE sc.name = :name")
    Optional<ServiceCategory> findByName(@Param("name") String name);
    
    @Query("SELECT COUNT(sc) FROM ServiceCategory sc WHERE sc.isActive = true")
    long countActiveCategories();
}
