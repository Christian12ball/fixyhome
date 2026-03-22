package com.fixyhome.controller;

import com.fixyhome.model.Review;
import com.fixyhome.model.User;
import com.fixyhome.security.JwtUtil;
import com.fixyhome.service.ReviewService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@CrossOrigin(origins = "*", allowCredentials = "false")
public class ReviewController {
    
    private final ReviewService reviewService;
    private final JwtUtil jwtUtil;
    
    public ReviewController(ReviewService reviewService, JwtUtil jwtUtil) {
        this.reviewService = reviewService;
        this.jwtUtil = jwtUtil;
    }
    
    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        List<Review> reviews = reviewService.getAllReviews();
        return ResponseEntity.ok(reviews);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Review> createReview(@Valid @RequestBody Review review, HttpServletRequest request) {
        String token = extractToken(request);
        String email = jwtUtil.extractUsername(token);
        
        Review created = reviewService.createReview(review, email);
        return ResponseEntity.status(201).body(created);
    }
    
    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
