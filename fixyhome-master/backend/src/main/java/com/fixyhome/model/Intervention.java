package com.fixyhome.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Entity
@Table(name = "interventions")
public class Intervention {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "La demande de service est obligatoire")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_request_id", nullable = false)
    private ServiceRequest serviceRequest;
    
    @NotNull(message = "L'artisan est obligatoire")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artisan_id", nullable = false)
    private User artisan;
    
    @NotNull(message = "Le client est obligatoire")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private User client;
    
    @NotNull(message = "Le statut est obligatoire")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ServiceStatus status;
    
    @Column(name = "start_time")
    private LocalDateTime startTime;
    
    @Column(name = "end_time")
    private LocalDateTime endTime;
    
    @Column(name = "actual_duration")
    private Integer actualDuration; // en minutes
    
    @Column(name = "actual_cost")
    private Integer actualCost;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "photos", columnDefinition = "jsonb")
    private String photos; // JSON array of photo URLs
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "materials_used", columnDefinition = "jsonb")
    private String materialsUsed; // JSON object of materials with costs
    
    @Min(value = 1, message = "La note doit être au moins 1")
    @Max(value = 5, message = "La note ne peut pas dépasser 5")
    @Column(name = "client_rating")
    private Integer clientRating;
    
    @Column(name = "client_feedback", columnDefinition = "TEXT")
    private String clientFeedback;
    
    @Column(name = "artisan_notes_internal", columnDefinition = "TEXT")
    private String artisanNotesInternal;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Champs pour le paiement Faroty
    @Column(name = "payment_session_token")
    private String paymentSessionToken;
    
    @Column(name = "payment_status")
    private String paymentStatus; // PENDING, COMPLETED, FAILED
    
    @Column(name = "payment_completed_at")
    private LocalDateTime paymentCompletedAt;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    // Constructeurs
    public Intervention() {
        this.createdAt = LocalDateTime.now();
        this.status = ServiceStatus.ACCEPTED;
    }
    
    public Intervention(ServiceRequest serviceRequest, User artisan, User client) {
        this();
        this.serviceRequest = serviceRequest;
        this.artisan = artisan;
        this.client = client;
    }
    
    // Getters et Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public ServiceRequest getServiceRequest() {
        return serviceRequest;
    }
    
    public void setServiceRequest(ServiceRequest serviceRequest) {
        this.serviceRequest = serviceRequest;
    }
    
    public User getArtisan() {
        return artisan;
    }
    
    public void setArtisan(User artisan) {
        this.artisan = artisan;
    }
    
    public User getClient() {
        return client;
    }
    
    public void setClient(User client) {
        this.client = client;
    }
    
    public ServiceStatus getStatus() {
        return status;
    }
    
    public void setStatus(ServiceStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getStartTime() {
        return startTime;
    }
    
    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }
    
    public LocalDateTime getEndTime() {
        return endTime;
    }
    
    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }
    
    public Integer getActualDuration() {
        return actualDuration;
    }
    
    public void setActualDuration(Integer actualDuration) {
        this.actualDuration = actualDuration;
    }
    
    public Integer getActualCost() {
        return actualCost;
    }
    
    public void setActualCost(Integer actualCost) {
        this.actualCost = actualCost;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public String getPhotos() {
        return photos;
    }
    
    public void setPhotos(String photos) {
        this.photos = photos;
    }
    
    public String getMaterialsUsed() {
        return materialsUsed;
    }
    
    public void setMaterialsUsed(String materialsUsed) {
        this.materialsUsed = materialsUsed;
    }
    
    public Integer getClientRating() {
        return clientRating;
    }
    
    public void setClientRating(Integer clientRating) {
        this.clientRating = clientRating;
    }
    
    public String getClientFeedback() {
        return clientFeedback;
    }
    
    public void setClientFeedback(String clientFeedback) {
        this.clientFeedback = clientFeedback;
    }
    
    public String getArtisanNotesInternal() {
        return artisanNotesInternal;
    }
    
    public void setArtisanNotesInternal(String artisanNotesInternal) {
        this.artisanNotesInternal = artisanNotesInternal;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public String getPaymentSessionToken() {
        return paymentSessionToken;
    }
    
    public void setPaymentSessionToken(String paymentSessionToken) {
        this.paymentSessionToken = paymentSessionToken;
    }
    
    public String getPaymentStatus() {
        return paymentStatus;
    }
    
    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
    
    public LocalDateTime getPaymentCompletedAt() {
        return paymentCompletedAt;
    }
    
    public void setPaymentCompletedAt(LocalDateTime paymentCompletedAt) {
        this.paymentCompletedAt = paymentCompletedAt;
    }
    
    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
    
    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // Méthodes utilitaires
    public boolean isInProgress() {
        return ServiceStatus.IN_PROGRESS.equals(this.status);
    }
    
    public boolean isCompleted() {
        return ServiceStatus.COMPLETED.equals(this.status);
    }
    
    public boolean isAccepted() {
        return ServiceStatus.ACCEPTED.equals(this.status);
    }
    
    // Calcul de la durée si non définie
    public Integer getCalculatedDuration() {
        if (actualDuration != null) {
            return actualDuration;
        }
        if (startTime != null && endTime != null) {
            return (int) java.time.Duration.between(startTime, endTime).toMinutes();
        }
        return null;
    }
}
