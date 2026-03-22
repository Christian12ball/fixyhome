package com.fixyhome.controller;

import com.fixyhome.model.User;
import com.fixyhome.model.UserType;
import com.fixyhome.repository.UserRepository;
import com.fixyhome.repository.ArtisanRepository;
import com.fixyhome.repository.ServiceCategoryRepository;
import com.fixyhome.model.Artisan;
import com.fixyhome.model.ServiceCategory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping({"/util", "/api/util"})
@CrossOrigin(origins = "http://localhost:3000")
public class UtilController {
    
    private final UserRepository userRepository;
    private final ArtisanRepository artisanRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;
    private final PasswordEncoder passwordEncoder;
    
    public UtilController(UserRepository userRepository, ArtisanRepository artisanRepository, ServiceCategoryRepository serviceCategoryRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.artisanRepository = artisanRepository;
        this.serviceCategoryRepository = serviceCategoryRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String email = request.get("email");
            String newPassword = request.get("password");
            
            if (email == null || newPassword == null) {
                response.put("success", false);
                response.put("error", "Email et mot de passe requis");
                return ResponseEntity.badRequest().body(response);
            }
            
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                response.put("success", false);
                response.put("error", "Utilisateur non trouvé: " + email);
                return ResponseEntity.notFound().build();
            }
            
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            
            response.put("success", true);
            response.put("message", "Mot de passe réinitialisé pour: " + email);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/create-user")
    public ResponseEntity<?> createUser(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String email = request.get("email");
            String firstName = request.get("firstName");
            String lastName = request.get("lastName");
            String phone = request.get("phone");
            String password = request.get("password");
            String userTypeStr = request.get("userType");
            
            if (email == null || firstName == null || lastName == null || password == null || userTypeStr == null) {
                response.put("success", false);
                response.put("error", "Champs requis manquants");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Vérifier si l'utilisateur existe déjà
            if (userRepository.existsByEmail(email)) {
                response.put("success", false);
                response.put("error", "L'email existe déjà: " + email);
                return ResponseEntity.badRequest().body(response);
            }
            
            UserType userType = UserType.valueOf(userTypeStr.toUpperCase());
            
            User user = new User();
            user.setEmail(email);
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setPhone(phone != null ? phone : "0000000000");
            user.setPassword(passwordEncoder.encode(password));
            user.setUserType(userType);
            
            User savedUser = userRepository.save(user);
            
            // Créer le profil artisan si nécessaire
            if (userType == UserType.ARTISAN) {
                Artisan artisan = new Artisan();
                artisan.setUser(savedUser);
                // Récupérer la catégorie par défaut "plumbing"
                ServiceCategory defaultCategory = serviceCategoryRepository.findByName("plumbing")
                    .orElseThrow(() -> new RuntimeException("Catégorie par défaut non trouvée"));
                artisan.setCategory(defaultCategory);
                artisan.setDescription("Artisan professionnel");
                artisan.setExperience(3);
                artisan.setHourlyRate(40);
                artisan.setIsVerified(true);
                artisan.setRating(4.0);
                artisanRepository.save(artisan);
            }
            
            response.put("success", true);
            response.put("message", "Utilisateur créé: " + email);
            response.put("userId", savedUser.getId());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
