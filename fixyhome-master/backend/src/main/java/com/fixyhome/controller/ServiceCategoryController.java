package com.fixyhome.controller;

import com.fixyhome.model.ServiceCategory;
import com.fixyhome.repository.ServiceCategoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping({"/service-categories", "/api/service-categories"})
@CrossOrigin(origins = "*", allowCredentials = "false")
public class ServiceCategoryController {
    
    private final ServiceCategoryRepository serviceCategoryRepository;
    
    public ServiceCategoryController(ServiceCategoryRepository serviceCategoryRepository) {
        this.serviceCategoryRepository = serviceCategoryRepository;
    }
    
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllCategories() {
        try {
            List<ServiceCategory> categories = serviceCategoryRepository.findActiveCategories();
            List<Map<String, Object>> response = categories.stream()
                .map(this::convertCategoryToMap)
                .toList();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getCategoryById(@PathVariable Long id) {
        try {
            Optional<ServiceCategory> category = serviceCategoryRepository.findById(id);
            if (category.isPresent() && category.get().getIsActive()) {
                return ResponseEntity.ok(convertCategoryToMap(category.get()));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> createCategory(@RequestBody Map<String, Object> categoryData) {
        try {
            ServiceCategory category = new ServiceCategory();
            category.setName((String) categoryData.get("name"));
            category.setLabel((String) categoryData.get("label"));
            category.setDescription((String) categoryData.get("description"));
            category.setIconUrl((String) categoryData.get("iconUrl"));
            category.setIsActive(categoryData.get("isActive") != null ? (Boolean) categoryData.get("isActive") : true);
            
            ServiceCategory savedCategory = serviceCategoryRepository.save(category);
            return ResponseEntity.ok(convertCategoryToMap(savedCategory));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
    
    private Map<String, Object> convertCategoryToMap(ServiceCategory category) {
        Map<String, Object> categoryMap = new HashMap<>();
        categoryMap.put("id", category.getId());
        categoryMap.put("name", category.getName());
        categoryMap.put("label", category.getLabel());
        categoryMap.put("description", category.getDescription());
        categoryMap.put("iconUrl", category.getIconUrl());
        categoryMap.put("isActive", category.getIsActive());
        categoryMap.put("createdAt", category.getCreatedAt());
        categoryMap.put("updatedAt", category.getUpdatedAt());
        return categoryMap;
    }
}
