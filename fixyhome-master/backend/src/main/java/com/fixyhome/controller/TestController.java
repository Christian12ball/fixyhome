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
@RequestMapping({"/test", "/api/test"})
@CrossOrigin(origins = "http://localhost:3000")
public class TestController {
    
    private final UserRepository userRepository;
    private final ArtisanRepository artisanRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;
    private final PasswordEncoder passwordEncoder;
    
    public TestController(UserRepository userRepository, ArtisanRepository artisanRepository, ServiceCategoryRepository serviceCategoryRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.artisanRepository = artisanRepository;
        this.serviceCategoryRepository = serviceCategoryRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    @PostMapping("/create-users")
    public ResponseEntity<?> createTestUsers() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Créer client de test
            if (!userRepository.existsByEmail("client@test.com")) {
                User client = new User();
                client.setEmail("client@test.com");
                client.setFirstName("Client");
                client.setLastName("Test");
                client.setPhone("0600000001");
                client.setPassword(passwordEncoder.encode("password"));
                client.setUserType(UserType.CLIENT);
                userRepository.save(client);
                response.put("client", "Client créé: client@test.com / password");
            } else {
                response.put("client", "Client existe déjà: client@test.com");
            }
            
            // Créer artisan de test
            if (!userRepository.existsByEmail("artisan@test.com")) {
                User artisanUser = new User();
                artisanUser.setEmail("artisan@test.com");
                artisanUser.setFirstName("Artisan");
                artisanUser.setLastName("Test");
                artisanUser.setPhone("0600000002");
                artisanUser.setPassword(passwordEncoder.encode("password"));
                artisanUser.setUserType(UserType.ARTISAN);
                User savedArtisan = userRepository.save(artisanUser);
                
                // Créer profil artisan
                Artisan artisan = new Artisan();
                artisan.setUser(savedArtisan);
                // Récupérer la catégorie par défaut "plumbing"
                ServiceCategory defaultCategory = serviceCategoryRepository.findByName("plumbing")
                    .orElseThrow(() -> new RuntimeException("Catégorie par défaut non trouvée"));
                artisan.setCategory(defaultCategory);
                artisan.setDescription("Artisan plombier expérimenté");
                artisan.setExperience(5);
                artisan.setHourlyRate(50);
                artisan.setIsVerified(true);
                artisan.setRating(4.5);
                artisanRepository.save(artisan);
                
                response.put("artisan", "Artisan créé: artisan@test.com / password");
            } else {
                response.put("artisan", "Artisan existe déjà: artisan@test.com");
            }
            
            // Créer admin
            if (!userRepository.existsByEmail("admin@fixyhome.com")) {
                User admin = new User();
                admin.setEmail("admin@fixyhome.com");
                admin.setFirstName("Admin");
                admin.setLastName("FixyHome");
                admin.setPhone("0600000000");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setUserType(UserType.ADMIN);
                userRepository.save(admin);
                response.put("admin", "Admin créé: admin@fixyhome.com / admin123");
            } else {
                response.put("admin", "Admin existe déjà: admin@fixyhome.com");
            }
            
            response.put("success", true);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }
}
