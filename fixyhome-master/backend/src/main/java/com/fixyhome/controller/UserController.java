package com.fixyhome.controller;

import com.fixyhome.dto.AuthRequest;
import com.fixyhome.dto.AuthResponse;
import com.fixyhome.model.User;
import com.fixyhome.model.UserType;
import com.fixyhome.repository.UserRepository;
import com.fixyhome.security.JwtUtil;
import com.fixyhome.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/users", "/api/users", "/api/clients", "/api/artisans"})
@CrossOrigin(origins = "*", allowCredentials = "false")
public class UserController {
    
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    
    public UserController(UserService userService, JwtUtil jwtUtil, AuthenticationManager authenticationManager, UserRepository userRepository) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
    }
    
    @PostMapping("/clients/authenticate")
    public ResponseEntity<?> authenticateClient(@Valid @RequestBody AuthRequest authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()));

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userRepository.findByEmail(authRequest.getEmail()).orElse(null);

            if (user == null || user.getUserType() != UserType.CLIENT) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Utilisateur non trouvé ou non client");
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
            error.put("message", "Erreur d'authentification client: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }
    
    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(@Valid @RequestBody AuthRequest authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()));

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userRepository.findByEmail(authRequest.getEmail()).orElse(null);

            if (user == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Utilisateur non trouvé");
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
            error.put("error", "Erreur d'authentification: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @PostMapping("/artisans/authenticate")
    public ResponseEntity<?> authenticateArtisan(@Valid @RequestBody AuthRequest authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()));

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userRepository.findByEmail(authRequest.getEmail()).orElse(null);

            if (user == null || user.getUserType() != UserType.ARTISAN) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Utilisateur non trouvé ou non artisan");
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
            error.put("message", "Erreur d'authentification artisan: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }
    
    @GetMapping("/profile")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ARTISAN')")
    public ResponseEntity<User> getProfile(HttpServletRequest request) {
        String token = extractToken(request);
        String email = jwtUtil.extractUsername(token);
        
        User user = userService.findByEmail(email);
        return ResponseEntity.ok(user);
    }
    
    @PutMapping("/profile")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ARTISAN')")
    public ResponseEntity<User> updateProfile(@Valid @RequestBody User userDetails, HttpServletRequest request) {
        String token = extractToken(request);
        String email = jwtUtil.extractUsername(token);
        
        User currentUser = userService.findByEmail(email);
        User updated = userService.updateUser(currentUser.getId(), userDetails);
        
        return ResponseEntity.ok(updated);
    }
    
    @GetMapping("/profiles/artisans")
    @CrossOrigin(origins = "*")
    public ResponseEntity<List<Map<String, Object>>> getArtisanProfiles() {
        try {
            List<Map<String, Object>> artisanProfiles = userService.getArtisanProfiles();
            return ResponseEntity.ok(artisanProfiles);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/public/artisans")
    @CrossOrigin(origins = "*")
    public ResponseEntity<List<Map<String, Object>>> getPublicArtisans() {
        try {
            List<Map<String, Object>> artisanProfiles = userService.getArtisanProfiles();
            return ResponseEntity.ok(artisanProfiles);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/profiles")
    @CrossOrigin(origins = "*")
    public ResponseEntity<List<Map<String, Object>>> getAllProfiles() {
        try {
            List<Map<String, Object>> allProfiles = userService.getAllProfiles();
            return ResponseEntity.ok(allProfiles);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
