package com.fixyhome.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Max;
import java.util.List;

@Entity
@Table(name = "artisans")
public class Artisan {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Relations
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    
    @NotNull(message = "La catégorie est obligatoire")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private ServiceCategory category;
    
    @NotBlank(message = "La description est obligatoire")
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Min(value = 0, message = "L'expérience ne peut pas être négative")
    @Column(nullable = false)
    private Integer experience;
    
    @Min(value = 0, message = "La note ne peut pas être négative")
    @Max(value = 5, message = "La note ne peut pas dépasser 5")
    @Column(nullable = false)
    private Double rating;
    
    @Min(value = 0, message = "Le nombre d'avis ne peut pas être négatif")
    @Column(nullable = false)
    private Integer reviewCount;
    
    @Column(nullable = false)
    private Boolean isVerified;
    
    @Column(name = "hourly_rate")
    private Integer hourlyRate;
    
    @Column(name = "location")
    private String location;
    
    // Relations
    @OneToMany(mappedBy = "artisan", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Review> reviews;
    
    // Constructeurs
    public Artisan() {
        this.rating = 0.0;
        this.reviewCount = 0;
        this.isVerified = false;
    }
    
    public Artisan(User user, ServiceCategory category, String description, 
                   Integer experience, Integer hourlyRate) {
        this();
        this.user = user;
        this.category = category;
        this.description = description;
        this.experience = experience;
        this.hourlyRate = hourlyRate;
    }
    
    // Getters et Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public ServiceCategory getCategory() {
        return category;
    }
    
    public void setCategory(ServiceCategory category) {
        this.category = category;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Integer getExperience() {
        return experience;
    }
    
    public void setExperience(Integer experience) {
        this.experience = experience;
    }
    
    public Double getRating() {
        return rating;
    }
    
    public void setRating(Double rating) {
        this.rating = rating;
    }
    
    public Integer getReviewCount() {
        return reviewCount;
    }
    
    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
    }
    
    public Boolean getIsVerified() {
        return isVerified;
    }
    
    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
    }
    
    public Integer getHourlyRate() {
        return hourlyRate;
    }
    
    public void setHourlyRate(Integer hourlyRate) {
        this.hourlyRate = hourlyRate;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public List<Review> getReviews() {
        return reviews;
    }
    
    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }
}
