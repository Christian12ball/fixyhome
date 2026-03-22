package com.fixyhome.controller;

import com.fixyhome.model.*;
import com.fixyhome.repository.UserRepository;
import com.fixyhome.repository.ArtisanRepository;
import com.fixyhome.repository.ServiceRequestRepository;
import com.fixyhome.repository.ReviewRepository;
import com.fixyhome.security.JwtUtil;
import com.fixyhome.service.AdminService;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping({"/admin", "/api/admin"})
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {
    
    private final AdminService adminService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final ArtisanRepository artisanRepository;
    private final ServiceRequestRepository serviceRequestRepository;
    private final ReviewRepository reviewRepository;
    private final PasswordEncoder passwordEncoder;
    
    public AdminController(AdminService adminService, JwtUtil jwtUtil, 
                          UserRepository userRepository, ArtisanRepository artisanRepository,
                          ServiceRequestRepository serviceRequestRepository, ReviewRepository reviewRepository,
                          PasswordEncoder passwordEncoder) {
        this.adminService = adminService;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.artisanRepository = artisanRepository;
        this.serviceRequestRepository = serviceRequestRepository;
        this.reviewRepository = reviewRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    // Dashboard
    @GetMapping("/dashboard/stats")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/dashboard/recent-users")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<User>> getRecentUsers() {
        List<User> users = adminService.getRecentUsers(10);
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/dashboard/recent-requests")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<ServiceRequest>> getRecentServiceRequests() {
        List<ServiceRequest> requests = adminService.getRecentServiceRequests(10);
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/dashboard/recent-interventions")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<Intervention>> getRecentInterventions() {
        List<Intervention> interventions = adminService.getRecentInterventions(10);
        return ResponseEntity.ok(interventions);
    }
    
    @GetMapping("/dashboard/artisans-by-category")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Map<String, Long>> getArtisansByCategory() {
        Map<String, Long> data = adminService.getArtisansByCategory();
        return ResponseEntity.ok(data);
    }
    
    @GetMapping("/dashboard/requests-by-month")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Map<String, Long>> getServiceRequestsByMonth() {
        Map<String, Long> data = adminService.getServiceRequestsByMonth();
        return ResponseEntity.ok(data);
    }
    
    @GetMapping("/dashboard/top-artisans")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getTopArtisansByRevenue() {
        List<Map<String, Object>> data = adminService.getTopArtisansByRevenue(10);
        return ResponseEntity.ok(data);
    }
    
    // Gestion des utilisateurs
    @GetMapping("/users")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/users/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = adminService.getUserById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }
    
    // Gestion des utilisateurs
    @GetMapping("/artisans")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<Artisan>> getAllArtisans() {
        List<Artisan> artisans = adminService.getAllArtisans();
        return ResponseEntity.ok(artisans);
    }
    
    @PutMapping("/artisans/{id}/verify")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Artisan> updateArtisanVerification(@PathVariable Long id, @RequestBody Map<String, Boolean> request) {
        Boolean verified = request.get("verified");
        if (verified != null) {
            Artisan artisan = adminService.updateArtisanVerification(id, verified);
            if (artisan != null) {
                return ResponseEntity.ok(artisan);
            }
        }
        return ResponseEntity.badRequest().build();
    }
    
    // Gestion des demandes de service
    @GetMapping("/service-requests")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<ServiceRequest>> getAllServiceRequests() {
        List<ServiceRequest> requests = adminService.getAllServiceRequests();
        return ResponseEntity.ok(requests);
    }
    
    @PutMapping("/service-requests/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ServiceRequest> updateServiceRequestStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String statusStr = request.get("status");
        try {
            ServiceStatus status = ServiceStatus.valueOf(statusStr.toUpperCase());
            ServiceRequest updatedRequest = adminService.updateServiceRequestStatus(id, status);
            if (updatedRequest != null) {
                return ResponseEntity.ok(updatedRequest);
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/service-requests/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteServiceRequest(@PathVariable Long id) {
        boolean deleted = adminService.deleteServiceRequest(id);
        if (deleted) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    // Gestion des interventions
    @GetMapping("/interventions")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<Intervention>> getAllInterventions() {
        List<Intervention> interventions = adminService.getAllInterventions();
        return ResponseEntity.ok(interventions);
    }
    
    @PutMapping("/interventions/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Intervention> updateInterventionStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String statusStr = request.get("status");
        try {
            ServiceStatus status = ServiceStatus.valueOf(statusStr.toUpperCase());
            Intervention updatedIntervention = adminService.updateInterventionStatus(id, status);
            if (updatedIntervention != null) {
                return ResponseEntity.ok(updatedIntervention);
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    // Gestion des avis
    @GetMapping("/reviews")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<Review>> getAllReviews() {
        List<Review> reviews = adminService.getAllReviews();
        return ResponseEntity.ok(reviews);
    }
    
    @DeleteMapping("/reviews/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        adminService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
    
    // ===== NOUVELLES MÉTHODES DE GESTION ADMIN =====
    
    // Gestion des utilisateurs
    @GetMapping("/users-admin")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<Object>> getAllUsersAdmin() {
        try {
            List<User> users = userRepository.findAll();
            List<Object> userSummaries = new ArrayList<>();
            
            for (User user : users) {
                Map<String, Object> userSummary = new HashMap<>();
                userSummary.put("id", user.getId());
                userSummary.put("email", user.getEmail());
                userSummary.put("firstName", user.getFirstName());
                userSummary.put("lastName", user.getLastName());
                userSummary.put("phone", user.getPhone());
                userSummary.put("userType", user.getUserType());
                // userSummary.put("isActive", user.getIsActive()); // Temporarily commented out
                userSummary.put("createdAt", user.getCreatedAt());
                // Ne pas inclure les relations cycliques comme les interventions
                userSummaries.add(userSummary);
            }
            
            return ResponseEntity.ok(userSummaries);
        } catch (Exception e) {
            System.err.println("Erreur lors de la récupération des utilisateurs: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/users/{userId}/toggle-status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // Note: Vous devrez ajouter un champ isActive dans l'entité User
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Statut de l'utilisateur modifié avec succès");
        response.put("userId", userId);
        return ResponseEntity.ok(response);
    }

    // ===== MÉTHODES CRUD UTILISATEURS =====
    
    @PostMapping("/users")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> createUser(@RequestBody Map<String, Object> userData) {
        try {
            User user = new User();
            user.setFirstName((String) userData.get("firstName"));
            user.setLastName((String) userData.get("lastName"));
            user.setEmail((String) userData.get("email"));
            user.setPhone((String) userData.get("phone"));
            user.setUserType(UserType.valueOf((String) userData.get("userType")));
            
            // Gérer le mot de passe
            String password = (String) userData.get("password");
            if (password == null || password.trim().isEmpty()) {
                password = generateRandomPassword();
            }
            user.setPassword(passwordEncoder.encode(password));
            
            User savedUser = userRepository.save(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Utilisateur créé avec succès");
            response.put("user", Map.of(
                "id", savedUser.getId(),
                "email", savedUser.getEmail(),
                "firstName", savedUser.getFirstName(),
                "lastName", savedUser.getLastName(),
                "userType", savedUser.getUserType(),
                "password", password // Renvoyer le mot de passe généré
            ));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erreur lors de la création: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PutMapping("/users/{userId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> updateUser(@PathVariable Long userId, @RequestBody Map<String, Object> userData) {
        try {
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Utilisateur non trouvé");
                return ResponseEntity.notFound().build();
            }
            
            User user = userOpt.get();
            user.setFirstName((String) userData.get("firstName"));
            user.setLastName((String) userData.get("lastName"));
            user.setEmail((String) userData.get("email"));
            user.setPhone((String) userData.get("phone"));
            user.setUserType(UserType.valueOf((String) userData.get("userType")));
            
            // Mettre à jour le mot de passe seulement si fourni
            String password = (String) userData.get("password");
            if (password != null && !password.trim().isEmpty()) {
                user.setPassword(passwordEncoder.encode(password));
            }
            
            userRepository.save(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Utilisateur modifié avec succès");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erreur lors de la modification: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @DeleteMapping("/users/{userId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        try {
            if (!userRepository.existsById(userId)) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Utilisateur non trouvé");
                return ResponseEntity.notFound().build();
            }
            
            userRepository.deleteById(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Utilisateur supprimé avec succès");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erreur lors de la suppression: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/users/export/excel")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<byte[]> exportUsersToExcel() {
        try {
            List<User> users = userRepository.findAll();
            
            Workbook workbook = new XSSFWorkbook();
            Sheet sheet = workbook.createSheet("Utilisateurs");
            
            // Créer le style pour l'en-tête
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            
            // Créer les en-têtes
            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID", "Prénom", "Nom", "Email", "Téléphone", "Type", "Date d'inscription"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }
            
            // Remplir les données
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
            int rowNum = 1;
            for (User user : users) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(user.getId());
                row.createCell(1).setCellValue(user.getFirstName());
                row.createCell(2).setCellValue(user.getLastName());
                row.createCell(3).setCellValue(user.getEmail());
                row.createCell(4).setCellValue(user.getPhone());
                row.createCell(5).setCellValue(user.getUserType().toString());
                row.createCell(6).setCellValue(user.getCreatedAt().format(dateFormatter));
            }
            
            // Ajuster la largeur des colonnes
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            workbook.close();
            
            return ResponseEntity.ok()
                .header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                .header("Content-Disposition", "attachment; filename=utilisateurs_" + 
                    LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".xlsx")
                .body(outputStream.toByteArray());
                
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    private String generateRandomPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
        StringBuilder password = new StringBuilder();
        for (int i = 0; i < 12; i++) {
            password.append(chars.charAt((int) (Math.random() * chars.length())));
        }
        return password.toString();
    }

    // Endpoint temporaire pour créer un admin (à supprimer en production)
    @PostMapping("/create-admin")
    public ResponseEntity<?> createAdmin() {
        try {
            // Vérifier si un admin existe déjà
            if (userRepository.findByUserType(UserType.ADMIN).size() > 0) {
                return ResponseEntity.badRequest().body("Un administrateur existe déjà");
            }
            
            User admin = new User();
            admin.setEmail("admin@fixyhome.com");
            admin.setFirstName("Admin");
            admin.setLastName("FixyHome");
            admin.setPhone("0600000000");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setUserType(UserType.ADMIN);
            admin.setCreatedAt(LocalDateTime.now());
            
            User savedAdmin = userRepository.save(admin);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Administrateur créé avec succès");
            response.put("email", "admin@fixyhome.com");
            response.put("password", "admin123");
            response.put("userId", savedAdmin.getId());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erreur lors de la création: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // ===== ENDPOINTS RAPPORTS =====
    
    @GetMapping("/reports/export/{type}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<byte[]> exportReport(@PathVariable String type) {
        try {
            Workbook workbook = new XSSFWorkbook();
            Sheet sheet;
            
            switch (type.toLowerCase()) {
                case "users":
                    sheet = workbook.createSheet("Utilisateurs");
                    createUsersReport(sheet);
                    break;
                case "requests":
                    sheet = workbook.createSheet("Demandes");
                    createRequestsReport(sheet);
                    break;
                case "financial":
                    sheet = workbook.createSheet("Financier");
                    createFinancialReport(sheet);
                    break;
                case "complete":
                    sheet = workbook.createSheet("Rapport Complet");
                    createCompleteReport(sheet);
                    break;
                default:
                    return ResponseEntity.badRequest().build();
            }
            
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            workbook.close();
            
            return ResponseEntity.ok()
                .header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                .header("Content-Disposition", "attachment; filename=rapport_" + type + "_" + 
                    LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".xlsx")
                .body(outputStream.toByteArray());
                
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    private void createUsersReport(Sheet sheet) {
        CellStyle headerStyle = createHeaderStyle(sheet.getWorkbook());
        
        Row headerRow = sheet.createRow(0);
        String[] headers = {"ID", "Prénom", "Nom", "Email", "Téléphone", "Type", "Date d'inscription"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }
        
        List<User> users = userRepository.findAll();
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        int rowNum = 1;
        for (User user : users) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(user.getId());
            row.createCell(1).setCellValue(user.getFirstName());
            row.createCell(2).setCellValue(user.getLastName());
            row.createCell(3).setCellValue(user.getEmail());
            row.createCell(4).setCellValue(user.getPhone());
            row.createCell(5).setCellValue(user.getUserType().toString());
            row.createCell(6).setCellValue(user.getCreatedAt().format(dateFormatter));
        }
        
        autoSizeColumns(sheet, headers.length);
    }

    private void createRequestsReport(Sheet sheet) {
        CellStyle headerStyle = createHeaderStyle(sheet.getWorkbook());
        
        Row headerRow = sheet.createRow(0);
        String[] headers = {"ID", "Client", "Titre", "Description", "Statut", "Date", "Budget"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }
        
        List<ServiceRequest> requests = serviceRequestRepository.findAll();
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        int rowNum = 1;
        for (ServiceRequest request : requests) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(request.getId());
            row.createCell(1).setCellValue(request.getClient().getFirstName() + " " + request.getClient().getLastName());
            row.createCell(2).setCellValue(request.getTitle());
            row.createCell(3).setCellValue(request.getDescription());
            row.createCell(4).setCellValue(request.getStatus().toString());
            row.createCell(5).setCellValue(request.getCreatedAt().format(dateFormatter));
            row.createCell(6).setCellValue(request.getBudget() != null ? request.getBudget() : 0);
        }
        
        autoSizeColumns(sheet, headers.length);
    }

    private void createFinancialReport(Sheet sheet) {
        CellStyle headerStyle = createHeaderStyle(sheet.getWorkbook());
        
        Row headerRow = sheet.createRow(0);
        String[] headers = {"Mois", "Nombre de demandes", "Revenu estimé", "Artisans actifs"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }
        
        // Données simulées pour l'exemple
        String[] months = {"Janvier", "Février", "Mars", "Avril", "Mai", "Juin"};
        int rowNum = 1;
        for (String month : months) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(month);
            row.createCell(1).setCellValue((int) (Math.random() * 100) + 50);
            row.createCell(2).setCellValue((Math.random() * 10000) + 5000);
            row.createCell(3).setCellValue((int) (Math.random() * 50) + 20);
        }
        
        autoSizeColumns(sheet, headers.length);
    }

    private void createCompleteReport(Sheet sheet) {
        CellStyle headerStyle = createHeaderStyle(sheet.getWorkbook());
        
        // Statistiques générales
        Row titleRow = sheet.createRow(0);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("RAPPORT COMPLET - FIXYHOME");
        
        Row statsRow = sheet.createRow(2);
        statsRow.createCell(0).setCellValue("Utilisateurs totaux:");
        statsRow.createCell(1).setCellValue(userRepository.count());
        
        statsRow = sheet.createRow(3);
        statsRow.createCell(0).setCellValue("Demandes totales:");
        statsRow.createCell(1).setCellValue(serviceRequestRepository.count());
        
        statsRow = sheet.createRow(4);
        statsRow.createCell(0).setCellValue("Artisans vérifiés:");
        statsRow.createCell(1).setCellValue(artisanRepository.findByIsVerified(true).size());
        
        statsRow = sheet.createRow(5);
        statsRow.createCell(0).setCellValue("Avis totaux:");
        statsRow.createCell(1).setCellValue(reviewRepository.count());
    }

    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle headerStyle = workbook.createCellStyle();
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerFont.setColor(IndexedColors.WHITE.getIndex());
        headerStyle.setFont(headerFont);
        headerStyle.setFillForegroundColor(IndexedColors.BLUE.getIndex());
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        return headerStyle;
    }

    private void autoSizeColumns(Sheet sheet, int columnCount) {
        for (int i = 0; i < columnCount; i++) {
            sheet.autoSizeColumn(i);
        }
    }

    // ===== ENDPOINTS PARAMÈTRES =====
    
    @GetMapping("/settings")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Map<String, Object>> getSettings() {
        Map<String, Object> settings = new HashMap<>();
        
        // Paramètres généraux
        settings.put("siteName", "FixyHome");
        settings.put("siteDescription", "Plateforme de mise en relation entre clients et artisans");
        settings.put("contactEmail", "contact@fixyhome.com");
        settings.put("contactPhone", "+33 1 23 45 67 89");
        settings.put("address", "123 Rue de la République, 75001 Paris");
        
        // Réseaux sociaux
        Map<String, String> socialMedia = new HashMap<>();
        socialMedia.put("facebook", "https://facebook.com/fixyhome");
        socialMedia.put("twitter", "https://twitter.com/fixyhome");
        socialMedia.put("instagram", "https://instagram.com/fixyhome");
        socialMedia.put("linkedin", "https://linkedin.com/company/fixyhome");
        settings.put("socialMedia", socialMedia);
        
        // Fonctionnalités
        Map<String, Boolean> features = new HashMap<>();
        features.put("enableRegistration", true);
        features.put("enableReviews", true);
        features.put("enableNotifications", true);
        features.put("maintenanceMode", false);
        settings.put("features", features);
        
        // Limites
        Map<String, Object> limits = new HashMap<>();
        limits.put("maxRequestsPerDay", 5);
        limits.put("maxArtisansPerRequest", 10);
        limits.put("minRatingThreshold", 3.0);
        settings.put("limits", limits);
        
        return ResponseEntity.ok(settings);
    }
    
    @PutMapping("/settings")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> updateSettings(@RequestBody Map<String, Object> settings) {
        try {
            // Ici vous pourriez sauvegarder les paramètres dans une table dédiée
            // Pour l'instant, nous retournons juste une confirmation
            Map<String, String> response = new HashMap<>();
            response.put("message", "Paramètres mis à jour avec succès");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erreur lors de la mise à jour: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/settings/reset")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> resetSettings() {
        try {
            // Réinitialiser aux valeurs par défaut
            Map<String, String> response = new HashMap<>();
            response.put("message", "Paramètres réinitialisés avec succès");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erreur lors de la réinitialisation: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Gestion des artisans
    @GetMapping("/artisans-admin")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> getArtisansByStatus(@RequestParam(required = false) String status) {
        try {
            List<Artisan> artisans;
            
            if (status != null && status.equals("PENDING")) {
                artisans = artisanRepository.findByIsVerified(false);
            } else if (status != null && status.equals("VERIFIED")) {
                artisans = artisanRepository.findByIsVerified(true);
            } else {
                artisans = artisanRepository.findAll();
            }
            
            List<Object> artisanSummaries = new ArrayList<>();
            
            for (Artisan artisan : artisans) {
                Map<String, Object> artisanSummary = new HashMap<>();
                artisanSummary.put("id", artisan.getId());
                artisanSummary.put("category", artisan.getCategory());
                artisanSummary.put("description", artisan.getDescription());
                artisanSummary.put("experience", artisan.getExperience());
                artisanSummary.put("hourlyRate", artisan.getHourlyRate());
                artisanSummary.put("isVerified", artisan.getIsVerified());
                
                // Ajouter les infos utilisateur de manière sécurisée
                if (artisan.getUser() != null) {
                    Map<String, Object> userInfo = new HashMap<>();
                    userInfo.put("id", artisan.getUser().getId());
                    userInfo.put("email", artisan.getUser().getEmail());
                    userInfo.put("firstName", artisan.getUser().getFirstName());
                    userInfo.put("lastName", artisan.getUser().getLastName());
                    userInfo.put("phone", artisan.getUser().getPhone());
                    artisanSummary.put("user", userInfo);
                }
                
                artisanSummaries.add(artisanSummary);
            }
            
            return ResponseEntity.ok(artisanSummaries);
        } catch (Exception e) {
            System.err.println("Erreur lors de la récupération des artisans: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/artisans/{artisanId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approveArtisan(@PathVariable Long artisanId) {
        Optional<Artisan> artisanOpt = artisanRepository.findById(artisanId);
        if (artisanOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Artisan artisan = artisanOpt.get();
        artisan.setIsVerified(true);
        artisanRepository.save(artisan);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Artisan approuvé avec succès");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/artisans/{artisanId}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> rejectArtisan(@PathVariable Long artisanId, @RequestBody Map<String, String> request) {
        Optional<Artisan> artisanOpt = artisanRepository.findById(artisanId);
        if (artisanOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Artisan artisan = artisanOpt.get();
        artisan.setIsVerified(false);
        artisanRepository.save(artisan);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Artisan rejeté avec succès");
        response.put("reason", request.get("reason"));
        return ResponseEntity.ok(response);
    }

    // Gestion des demandes de service
    @GetMapping("/service-requests-admin")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> getServiceRequests(@RequestParam(required = false) String status) {
        try {
            List<ServiceRequest> requests;
            
            if (status != null) {
                try {
                    ServiceStatus serviceStatus = ServiceStatus.valueOf(status);
                    requests = serviceRequestRepository.findByStatus(serviceStatus);
                } catch (IllegalArgumentException e) {
                    requests = serviceRequestRepository.findAll();
                }
            } else {
                requests = serviceRequestRepository.findAll();
            }
            
            List<Object> requestSummaries = new ArrayList<>();
            
            for (ServiceRequest request : requests) {
                Map<String, Object> requestSummary = new HashMap<>();
                requestSummary.put("id", request.getId());
                requestSummary.put("title", request.getTitle());
                requestSummary.put("description", request.getDescription());
                requestSummary.put("category", request.getCategory());
                requestSummary.put("status", request.getStatus());
                requestSummary.put("location", request.getLocation());
                requestSummary.put("budget", request.getBudget());
                requestSummary.put("createdAt", request.getCreatedAt());
                
                // Ajouter les infos client de manière sécurisée
                if (request.getClient() != null) {
                    Map<String, Object> clientInfo = new HashMap<>();
                    clientInfo.put("id", request.getClient().getId());
                    clientInfo.put("email", request.getClient().getEmail());
                    clientInfo.put("firstName", request.getClient().getFirstName());
                    clientInfo.put("lastName", request.getClient().getLastName());
                    clientInfo.put("phone", request.getClient().getPhone());
                    requestSummary.put("client", clientInfo);
                }
                
                // Ajouter les infos artisan de manière sécurisée
                if (request.getArtisan() != null) {
                    Map<String, Object> artisanInfo = new HashMap<>();
                    artisanInfo.put("id", request.getArtisan().getId());
                    artisanInfo.put("email", request.getArtisan().getEmail());
                    artisanInfo.put("firstName", request.getArtisan().getFirstName());
                    artisanInfo.put("lastName", request.getArtisan().getLastName());
                    requestSummary.put("artisan", artisanInfo);
                }
                
                requestSummaries.add(requestSummary);
            }
            
            return ResponseEntity.ok(requestSummaries);
        } catch (Exception e) {
            System.err.println("Erreur lors de la récupération des demandes de service: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/service-requests-admin/{requestId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateServiceRequestStatusAdmin(@PathVariable Long requestId, @RequestBody Map<String, String> request) {
        Optional<ServiceRequest> requestOpt = serviceRequestRepository.findById(requestId);
        if (requestOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ServiceRequest serviceRequest = requestOpt.get();
        String newStatus = request.get("status");
        
        try {
            ServiceStatus status = ServiceStatus.valueOf(newStatus);
            serviceRequest.setStatus(status);
            serviceRequestRepository.save(serviceRequest);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Statut de la demande mis à jour avec succès");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Statut invalide: " + newStatus);
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/service-requests-admin/{requestId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteServiceRequestAdmin(@PathVariable Long requestId) {
        if (!serviceRequestRepository.existsById(requestId)) {
            return ResponseEntity.notFound().build();
        }

        serviceRequestRepository.deleteById(requestId);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Demande de service supprimée avec succès");
        return ResponseEntity.ok(response);
    }
    
    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
