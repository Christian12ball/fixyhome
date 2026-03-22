package com.fixyhome.controller;

import com.fixyhome.model.ServiceType;
import com.fixyhome.model.ServiceCategory;
import com.fixyhome.service.ServiceTypeService;
import com.fixyhome.repository.ServiceCategoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping({"/services", "/api/services"})
@CrossOrigin(origins = "*", allowCredentials = "false")
public class ServiceController {
    
    private final ServiceTypeService serviceTypeService;
    private final ServiceCategoryRepository serviceCategoryRepository;
    
    public ServiceController(ServiceTypeService serviceTypeService, ServiceCategoryRepository serviceCategoryRepository) {
        this.serviceTypeService = serviceTypeService;
        this.serviceCategoryRepository = serviceCategoryRepository;
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<Map<String, Object>>> getAllServices() {
        try {
            List<ServiceType> services = serviceTypeService.getAllServices();
            List<Map<String, Object>> response = services.stream()
                .map(this::convertToMap)
                .toList();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
    
    @GetMapping("/public")
    public ResponseEntity<List<Map<String, Object>>> getPublicServices() {
        return getAllServices(); // Même endpoint pour l'instant
    }
    
    @GetMapping("/public/category/{categoryId}")
    public ResponseEntity<List<Map<String, Object>>> getServicesByCategory(@PathVariable Long categoryId) {
        try {
            List<ServiceType> services = serviceTypeService.getServicesByCategoryId(categoryId);
            List<Map<String, Object>> response = services.stream()
                .map(this::convertToMap)
                .toList();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
    
    @GetMapping("/public/categories")
    public ResponseEntity<List<Map<String, Object>>> getPublicCategories() {
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
    public ResponseEntity<Map<String, Object>> getServiceById(@PathVariable Long id) {
        try {
            Optional<ServiceType> service = serviceTypeService.getServiceById(id);
            if (service.isPresent()) {
                return ResponseEntity.ok(convertToMap(service.get()));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
    
    private Map<String, Object> convertToMap(ServiceType service) {
        Map<String, Object> serviceMap = new HashMap<>();
        serviceMap.put("id", service.getId());
        serviceMap.put("label", service.getLabel());
        serviceMap.put("description", service.getDescription());
        serviceMap.put("iconUrl", service.getIconUrl());
        serviceMap.put("isActive", service.getIsActive());
        serviceMap.put("artisanCount", (int) (Math.random() * 10) + 1); // Temporaire
        
        // Ajouter les informations de la catégorie
        if (service.getCategory() != null) {
            Map<String, Object> categoryMap = new HashMap<>();
            categoryMap.put("id", service.getCategory().getId());
            categoryMap.put("label", service.getCategory().getLabel());
            categoryMap.put("description", service.getCategory().getDescription());
            categoryMap.put("name", service.getCategory().getName());
            serviceMap.put("category", categoryMap);
        }
        
        return serviceMap;
    }
    
    private Map<String, Object> convertCategoryToMap(ServiceCategory category) {
        Map<String, Object> categoryMap = new HashMap<>();
        categoryMap.put("id", category.getId());
        categoryMap.put("name", category.getName());
        categoryMap.put("label", category.getLabel());
        categoryMap.put("description", category.getDescription());
        categoryMap.put("iconUrl", category.getIconUrl());
        categoryMap.put("isActive", category.getIsActive());
        return categoryMap;
    }
}
