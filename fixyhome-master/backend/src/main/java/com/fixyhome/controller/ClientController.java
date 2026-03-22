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

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/client")
@CrossOrigin(origins = "http://localhost:3000")
public class ClientController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ClientController(AuthenticationManager authenticationManager, JwtUtil jwtUtil,
                        UserService userService, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            // Forcer le type à CLIENT
            registerRequest.setUserType(UserType.fromString("CLIENT"));

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
            error.put("error", "Erreur lors de l'inscription client: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(@Valid @RequestBody AuthRequest authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()));

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userRepository.findByEmail(authRequest.getEmail()).orElse(null);

            if (user == null || user.getUserType() != UserType.CLIENT) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Client non trouvé ou non autorisé");
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
            error.put("error", "Erreur d'authentification client: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getClientProfile(@RequestHeader("Authorization") String authorization) {
        try {
            String token = authorization.replace("Bearer ", "");
            String email = jwtUtil.extractUsername(token);
            
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Client non trouvé"));

            if (user.getUserType() != UserType.CLIENT) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Accès réservé aux clients"));
            }

            Map<String, Object> profile = new HashMap<>();
            profile.put("id", user.getId());
            profile.put("email", user.getEmail());
            profile.put("firstName", user.getFirstName());
            profile.put("lastName", user.getLastName());
            profile.put("phone", user.getPhone());
            profile.put("userType", user.getUserType().name());
            profile.put("createdAt", user.getCreatedAt());

            return ResponseEntity.ok(profile);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Erreur lors de la récupération du profil: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
