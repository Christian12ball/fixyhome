package com.fixyhome.controller;

import com.fixyhome.model.Artisan;
import com.fixyhome.model.Review;
import com.fixyhome.service.ArtisanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/artisans")
@CrossOrigin(origins = "*", allowCredentials = "false")
public class ArtisanController {
    
    private final ArtisanService artisanService;
    
    public ArtisanController(ArtisanService artisanService) {
        this.artisanService = artisanService;
    }
    
    @GetMapping
    public ResponseEntity<List<Artisan>> getArtisans(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location) {
        List<Artisan> artisans = artisanService.getArtisans(category, location);
        return ResponseEntity.ok(artisans);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Artisan> getArtisanById(@PathVariable Long id) {
        Artisan artisan = artisanService.getArtisanById(id);
        return ResponseEntity.ok(artisan);
    }
    
    @GetMapping("/{id}/reviews")
    public ResponseEntity<List<Review>> getArtisanReviews(@PathVariable Long id) {
        List<Review> reviews = artisanService.getArtisanReviews(id);
        return ResponseEntity.ok(reviews);
    }
}
