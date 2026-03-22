package com.fixyhome.controller;

import com.fixyhome.dto.AuthRequest;
import com.fixyhome.dto.AuthResponse;
import com.fixyhome.dto.RegisterRequest;
import com.fixyhome.model.User;
import com.fixyhome.model.UserType;
import com.fixyhome.repository.UserRepository;
import com.fixyhome.security.JwtUtil;
import com.fixyhome.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping({"/auth", "/api/auth"})
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil,
            UserService userService, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");
            
            if (email == null || password == null) {
                throw new IllegalArgumentException("Email et mot de passe requis");
            }
            
            userService.resetPassword(email, password);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Mot de passe réinitialisé avec succès");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erreur: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()));

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userRepository.findByEmail(authRequest.getEmail()).orElse(null);

            if (user == null) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Utilisateur non trouvé");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }

            String token = jwtUtil.generateToken(user.getEmail(), user.getUserType().name());

            AuthResponse response = new AuthResponse(
                    token,
                    user.getId(),
                    user.getEmail(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getUserType().name());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erreur d'authentification: " + e.getMessage());
            error.put("details", e.getClass().getName());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            // Vérifier si l'email existe déjà
            if (userRepository.existsByEmail(registerRequest.getEmail())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Cet email est déjà utilisé");
                return ResponseEntity.badRequest().body(error);
            }

            User user = userService.registerUser(registerRequest);

            String token = jwtUtil.generateToken(user.getEmail(), user.getUserType().name());

            AuthResponse response = new AuthResponse(
                    token,
                    user.getId(),
                    user.getEmail(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getUserType().name());

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Erreur lors de l'inscription: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Pour JWT, le logout est géré côté client en supprimant le token
        Map<String, String> response = new HashMap<>();
        response.put("message", "Déconnexion réussie");
        return ResponseEntity.ok(response);
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
            error.put("error", "Erreur lors de la création: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Endpoint temporaire pour réinitialiser le mot de passe admin
    @PostMapping("/reset-admin-password")
    public ResponseEntity<?> resetAdminPassword() {
        try {
            User admin = userRepository.findByEmail("admin@fixyhome.com")
                .orElseThrow(() -> new RuntimeException("Administrateur non trouvé"));
            
            admin.setPassword(passwordEncoder.encode("admin123"));
            userRepository.save(admin);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Mot de passe admin réinitialisé avec succès");
            response.put("email", "admin@fixyhome.com");
            response.put("password", "admin123");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Erreur lors de la réinitialisation: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
