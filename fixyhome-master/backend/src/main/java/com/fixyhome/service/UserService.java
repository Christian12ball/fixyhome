package com.fixyhome.service;

import com.fixyhome.dto.RegisterRequest;
import com.fixyhome.model.Artisan;
import com.fixyhome.model.ServiceCategory;
import com.fixyhome.model.User;
import com.fixyhome.model.UserType;
import com.fixyhome.repository.ArtisanRepository;
import com.fixyhome.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserService {
    
    private final UserRepository userRepository;
    private final ArtisanRepository artisanRepository;
    private final PasswordEncoder passwordEncoder;
    
    public UserService(UserRepository userRepository, ArtisanRepository artisanRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.artisanRepository = artisanRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Transactional
    public User registerUser(RegisterRequest registerRequest) {
        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setPhone(registerRequest.getPhone());
        user.setUserType(registerRequest.getUserType());
        
        // Sauvegarder l'utilisateur d'abord
        user = userRepository.save(user);
        
        // Si c'est un artisan, créer son profil professionnel
        if (registerRequest.getUserType() == UserType.ARTISAN) {
            Artisan artisan = new Artisan();
            artisan.setUser(user);
            artisan.setCategory(registerRequest.getCategory());
            artisan.setDescription(registerRequest.getDescription());
            artisan.setExperience(registerRequest.getExperience());
            artisan.setHourlyRate(registerRequest.getHourlyRate());
            
            artisanRepository.save(artisan);
        }
        
        return user;
    }
    
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
    
    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
    
    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            user.setFirstName(userDetails.getFirstName());
            user.setLastName(userDetails.getLastName());
            user.setPhone(userDetails.getPhone());
            return userRepository.save(user);
        }
        return null;
    }

    @Transactional
    public void resetPassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé: " + email));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
    
    public List<Map<String, Object>> getArtisanProfiles() {
        List<User> artisanUsers = userRepository.findByUserType(UserType.ARTISAN);
        List<Map<String, Object>> profiles = new ArrayList<>();
        
        for (User user : artisanUsers) {
            Map<String, Object> profile = new HashMap<>();
            profile.put("id", user.getId());
            profile.put("firstName", user.getFirstName());
            profile.put("lastName", user.getLastName());
            profile.put("email", user.getEmail());
            profile.put("phone", user.getPhone());
            profile.put("userType", user.getUserType().toString());
            profile.put("createdAt", user.getCreatedAt().toString());
            
            // Ajouter les informations de l'artisan si elles existent
            Artisan artisan = artisanRepository.findByUserId(user.getId()).orElse(null);
            if (artisan != null) {
                Map<String, Object> artisanInfo = new HashMap<>();
                artisanInfo.put("description", artisan.getDescription());
                artisanInfo.put("experience", artisan.getExperience());
                artisanInfo.put("rating", artisan.getRating());
                artisanInfo.put("reviewCount", artisan.getReviewCount());
                artisanInfo.put("isVerified", artisan.getIsVerified());
                artisanInfo.put("hourlyRate", artisan.getHourlyRate());
                artisanInfo.put("location", artisan.getLocation());
                
                // Ajouter les détails de la catégorie - approche robuste
                Map<String, Object> categoryInfo = new HashMap<>();
                try {
                    // Essayer d'abord la relation directe
                    if (artisan.getCategory() != null) {
                        categoryInfo.put("id", artisan.getCategory().getId());
                        categoryInfo.put("name", artisan.getCategory().getName());
                        categoryInfo.put("label", artisan.getCategory().getLabel());
                        categoryInfo.put("description", artisan.getCategory().getDescription());
                        categoryInfo.put("iconUrl", artisan.getCategory().getIconUrl());
                    } else {
                        // Si la relation est null, essayer de récupérer via category_id
                        // Pour l'instant, mettre une catégorie par défaut basée sur la description
                        String description = artisan.getDescription().toLowerCase();
                        if (description.contains("plomb")) {
                            categoryInfo.put("id", 1);
                            categoryInfo.put("name", "plumbing");
                            categoryInfo.put("label", "Plomberie");
                            categoryInfo.put("description", "Services de plomberie");
                            categoryInfo.put("iconUrl", "🔧");
                        } else if (description.contains("électric") || description.contains("electric")) {
                            categoryInfo.put("id", 2);
                            categoryInfo.put("name", "electricity");
                            categoryInfo.put("label", "Électricité");
                            categoryInfo.put("description", "Services électriques");
                            categoryInfo.put("iconUrl", "⚡");
                        } else if (description.contains("ménage") || description.contains("nettoy")) {
                            categoryInfo.put("id", 3);
                            categoryInfo.put("name", "cleaning");
                            categoryInfo.put("label", "Ménage");
                            categoryInfo.put("description", "Services de nettoyage");
                            categoryInfo.put("iconUrl", "🧹");
                        } else if (description.contains("jardin") || description.contains("paysag")) {
                            categoryInfo.put("id", 4);
                            categoryInfo.put("name", "gardening");
                            categoryInfo.put("label", "Jardinage");
                            categoryInfo.put("description", "Services de jardinage");
                            categoryInfo.put("iconUrl", "🌿");
                        } else if (description.contains("peint")) {
                            categoryInfo.put("id", 5);
                            categoryInfo.put("name", "painting");
                            categoryInfo.put("label", "Peinture");
                            categoryInfo.put("description", "Services de peinture");
                            categoryInfo.put("iconUrl", "🎨");
                        } else if (description.contains("menuis") || description.contains("ébén")) {
                            categoryInfo.put("id", 6);
                            categoryInfo.put("name", "carpentry");
                            categoryInfo.put("label", "Menuiserie");
                            categoryInfo.put("description", "Services de menuiserie");
                            categoryInfo.put("iconUrl", "🔨");
                        } else if (description.contains("climat") || description.contains("chauff")) {
                            categoryInfo.put("id", 7);
                            categoryInfo.put("name", "hvac");
                            categoryInfo.put("label", "Climatisation");
                            categoryInfo.put("description", "Services de climatisation");
                            categoryInfo.put("iconUrl", "❄️");
                        } else if (description.contains("toit") || description.contains("couvert")) {
                            categoryInfo.put("id", 8);
                            categoryInfo.put("name", "roofing");
                            categoryInfo.put("label", "Couverture");
                            categoryInfo.put("description", "Services de couverture");
                            categoryInfo.put("iconUrl", "🏠");
                        } else if (description.contains("déménag") || description.contains("transport")) {
                            categoryInfo.put("id", 9);
                            categoryInfo.put("name", "moving");
                            categoryInfo.put("label", "Déménagement");
                            categoryInfo.put("description", "Services de déménagement");
                            categoryInfo.put("iconUrl", "🚚");
                        } else if (description.contains("sécur") || description.contains("alarm") || description.contains("camér")) {
                            categoryInfo.put("id", 10);
                            categoryInfo.put("name", "security");
                            categoryInfo.put("label", "Sécurité");
                            categoryInfo.put("description", "Services de sécurité");
                            categoryInfo.put("iconUrl", "🔒");
                        } else {
                            // Catégorie par défaut
                            categoryInfo.put("id", 1);
                            categoryInfo.put("name", "plumbing");
                            categoryInfo.put("label", "Plomberie");
                            categoryInfo.put("description", "Services de plomberie");
                            categoryInfo.put("iconUrl", "🔧");
                        }
                    }
                } catch (Exception e) {
                    // En cas d'erreur, catégorie par défaut
                    categoryInfo.put("id", 1);
                    categoryInfo.put("name", "plumbing");
                    categoryInfo.put("label", "Plomberie");
                    categoryInfo.put("description", "Services de plomberie");
                    categoryInfo.put("iconUrl", "🔧");
                }
                
                artisanInfo.put("category", categoryInfo);
                profile.put("artisan", artisanInfo);
            }
            
            profiles.add(profile);
        }
        
        return profiles;
    }
    
    public List<Map<String, Object>> getAllProfiles() {
        List<User> allUsers = userRepository.findAll();
        List<Map<String, Object>> profiles = new ArrayList<>();
        
        for (User user : allUsers) {
            Map<String, Object> profile = new HashMap<>();
            profile.put("id", user.getId());
            profile.put("firstName", user.getFirstName());
            profile.put("lastName", user.getLastName());
            profile.put("email", user.getEmail());
            profile.put("phone", user.getPhone());
            profile.put("userType", user.getUserType().toString());
            profile.put("createdAt", user.getCreatedAt().toString());
            
            // Ajouter les informations de l'artisan si c'est un artisan
            if (user.getUserType() == UserType.ARTISAN) {
                Artisan artisan = artisanRepository.findByUserId(user.getId()).orElse(null);
                if (artisan != null) {
                    Map<String, Object> artisanInfo = new HashMap<>();
                    artisanInfo.put("description", artisan.getDescription());
                    artisanInfo.put("experience", artisan.getExperience());
                    artisanInfo.put("rating", artisan.getRating());
                    artisanInfo.put("reviewCount", artisan.getReviewCount());
                    artisanInfo.put("isVerified", artisan.getIsVerified());
                    artisanInfo.put("hourlyRate", artisan.getHourlyRate());
                    artisanInfo.put("category", artisan.getCategory().toString());
                    artisanInfo.put("location", artisan.getLocation());
                    profile.put("artisan", artisanInfo);
                }
            }
            
            profiles.add(profile);
        }
        
        return profiles;
    }
}
