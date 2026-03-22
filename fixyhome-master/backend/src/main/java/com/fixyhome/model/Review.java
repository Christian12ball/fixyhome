package com.fixyhome.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "La note est obligatoire")
    @Min(value = 1, message = "La note doit être au minimum de 1")
    @Max(value = 5, message = "La note ne peut pas dépasser 5")
    @Column(nullable = false)
    private Integer rating;
    
    @NotBlank(message = "Le commentaire est obligatoire")
    @Column(columnDefinition = "TEXT")
    private String comment;
    
    @NotNull(message = "Le client est obligatoire")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private User client;
    
    @NotNull(message = "L'artisan est obligatoire")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artisan_id", nullable = false)
    private Artisan artisan;
    
    @NotNull(message = "La demande de service est obligatoire")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_request_id", nullable = false)
    private ServiceRequest serviceRequest;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    // Constructeurs
    public Review() {
        this.createdAt = LocalDateTime.now();
    }
    
    public Review(Integer rating, String comment, User client, Artisan artisan, ServiceRequest serviceRequest) {
        this();
        this.rating = rating;
        this.comment = comment;
        this.client = client;
        this.artisan = artisan;
        this.serviceRequest = serviceRequest;
    }
    
    // Getters et Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Integer getRating() {
        return rating;
    }
    
    public void setRating(Integer rating) {
        this.rating = rating;
    }
    
    public String getComment() {
        return comment;
    }
    
    public void setComment(String comment) {
        this.comment = comment;
    }
    
    public User getClient() {
        return client;
    }
    
    public void setClient(User client) {
        this.client = client;
    }
    
    public Artisan getArtisan() {
        return artisan;
    }
    
    public void setArtisan(Artisan artisan) {
        this.artisan = artisan;
    }
    
    public ServiceRequest getServiceRequest() {
        return serviceRequest;
    }
    
    public void setServiceRequest(ServiceRequest serviceRequest) {
        this.serviceRequest = serviceRequest;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
