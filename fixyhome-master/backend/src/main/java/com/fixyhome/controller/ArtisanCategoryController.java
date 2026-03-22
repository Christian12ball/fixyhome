package com.fixyhome.controller;

import com.fixyhome.model.Artisan;
import com.fixyhome.model.ServiceCategory;
import com.fixyhome.repository.ArtisanRepository;
import com.fixyhome.repository.ServiceCategoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping({"/artisans", "/api/artisans"})
@CrossOrigin(origins = "*", allowCredentials = "false")
public class ArtisanCategoryController {
    
    private final ArtisanRepository artisanRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;
    
    public ArtisanCategoryController(ArtisanRepository artisanRepository, ServiceCategoryRepository serviceCategoryRepository) {
        this.artisanRepository = artisanRepository;
        this.serviceCategoryRepository = serviceCategoryRepository;
    }
    
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Map<String, Object>>> getArtisansByCategory(@PathVariable Long categoryId) {
        try {
            Optional<ServiceCategory> category = serviceCategoryRepository.findById(categoryId);
            if (category.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            // Récupérer les artisans par categoryId
            List<Artisan> artisans = artisanRepository.findByCategoryIdAndIsVerified(categoryId, true);
            
            List<Map<String, Object>> response = artisans.stream()
                .map(this::convertArtisanToMap)
                .collect(Collectors.toList());
                
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
    
    private Map<String, Object> convertArtisanToMap(Artisan artisan) {
        Map<String, Object> artisanMap = new HashMap<>();
        artisanMap.put("id", artisan.getId());
        artisanMap.put("description", artisan.getDescription());
        artisanMap.put("experience", artisan.getExperience());
        artisanMap.put("rating", artisan.getRating());
        artisanMap.put("reviewCount", artisan.getReviewCount());
        artisanMap.put("isVerified", artisan.getIsVerified());
        artisanMap.put("hourlyRate", artisan.getHourlyRate());
        artisanMap.put("location", artisan.getLocation());
        
        // Ajouter les informations de l'utilisateur si disponible
        if (artisan.getUser() != null) {
            artisanMap.put("userId", artisan.getUser().getId());
            artisanMap.put("firstName", artisan.getUser().getFirstName());
            artisanMap.put("lastName", artisan.getUser().getLastName());
            artisanMap.put("email", artisan.getUser().getEmail());
            artisanMap.put("phone", artisan.getUser().getPhone());
        }
        
        // Ajouter les informations de la catégorie si disponible
        if (artisan.getCategory() != null) {
            Map<String, Object> categoryMap = new HashMap<>();
            categoryMap.put("id", artisan.getCategory().getId());
            categoryMap.put("name", artisan.getCategory().getName());
            categoryMap.put("label", artisan.getCategory().getLabel());
            categoryMap.put("description", artisan.getCategory().getDescription());
            categoryMap.put("iconUrl", artisan.getCategory().getIconUrl());
            artisanMap.put("category", categoryMap);
        }
        
        return artisanMap;
    }
}
