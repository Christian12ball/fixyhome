package com.fixyhome.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {
    
    @Value("${jwt.secret}")
    private String secret;
    
    @Value("${jwt.expiration}")
    private Long expiration;
    
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }
    
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }
    
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
    
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    
    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
    
    // Token utilisateur standard (pour navigation dashboard)
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "USER_SESSION");
        return createToken(claims, userDetails.getUsername(), expiration);
    }
    
    // Token utilisateur avec userType
    public String generateToken(String username, String userType) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "USER_SESSION");
        claims.put("userType", userType);
        
        // Ajouter les autorités selon le type d'utilisateur
        List<String> authorities = new ArrayList<>();
        if ("ADMIN".equals(userType)) {
            authorities.add("ROLE_ADMIN");
        } else if ("ARTISAN".equals(userType)) {
            authorities.add("ROLE_ARTISAN");
        } else if ("CLIENT".equals(userType)) {
            authorities.add("ROLE_CLIENT");
        }
        authorities.add("ROLE_USER"); // Tous les utilisateurs ont ce rôle de base
        
        claims.put("authorities", authorities);
        
        return createToken(claims, username, expiration);
    }
    
    // Token Faroty temporaire (pour paiement uniquement)
    public String generateToken(Map<String, Object> claims) {
        // Le token Faroty a une durée de vie plus courte (15 minutes)
        long farotyExpiration = 15 * 60 * 1000; // 15 minutes
        return createToken(claims, (String) claims.get("userEmail"), farotyExpiration);
    }
    
    private String createToken(Map<String, Object> claims, String subject, Long expiration) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
    
    public Boolean validateToken(String token, String username) {
        final String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }
    
    // Validation du token utilisateur standard
    public Boolean validateUserToken(String token) {
        try {
            Claims claims = extractAllClaims(token);
            String tokenType = (String) claims.get("type");
            
            // Vérifier que c'est un token utilisateur standard
            if (!"USER_SESSION".equals(tokenType)) {
                return false;
            }
            
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    // Validation du token Faroty
    public Boolean validateFarotyToken(String token) {
        try {
            Claims claims = extractAllClaims(token);
            String tokenType = (String) claims.get("type");
            
            // Vérifier que c'est un token Faroty
            if (!"FAROTY_PAYMENT".equals(tokenType)) {
                return false;
            }
            
            // Vérifier l'expiration spécifique pour Faroty
            Long expiresAt = ((Number) claims.get("expiresAt")).longValue();
            return System.currentTimeMillis() <= expiresAt;
            
        } catch (Exception e) {
            return false;
        }
    }

    // Obtenir le type de token
    public String getTokenType(String token) {
        try {
            Claims claims = extractAllClaims(token);
            return (String) claims.get("type");
        } catch (Exception e) {
            return null;
        }
    }

    // Rafraîchir un token utilisateur
    public String refreshToken(String token) {
        try {
            Claims claims = extractAllClaims(token);
            String tokenType = (String) claims.get("type");
            
            if ("USER_SESSION".equals(tokenType)) {
                // Créer un nouveau token utilisateur avec les mêmes claims
                Map<String, Object> newClaims = new HashMap<>(claims);
                newClaims.remove("iat"); // Remove issued at
                newClaims.remove("exp"); // Remove expiration
                
                return createToken(newClaims, claims.getSubject(), expiration);
            }
        } catch (Exception e) {
            // Si le token est invalide, retourner null
            return null;
        }
        
        return null;
    }

    // Obtenir le temps d'expiration restant en millisecondes
    public Long getRemainingExpiration(String token) {
        try {
            Date expiration = extractExpiration(token);
            return expiration.getTime() - System.currentTimeMillis();
        } catch (Exception e) {
            return 0L;
        }
    }
}
