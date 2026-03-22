package com.fixyhome.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import com.fixyhome.security.CustomUserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;
    
    public JwtAuthenticationFilter(JwtUtil jwtUtil, CustomUserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        final String authorizationHeader = request.getHeader("Authorization");
        
        // Ignorer le filtre pour les endpoints publics
        String requestPath = request.getRequestURI();
        System.out.println("JWT Filter - Request path: " + requestPath);
        if (requestPath.startsWith("/api/auth/") || requestPath.startsWith("/auth/") || 
            requestPath.startsWith("/api/artisans") || requestPath.startsWith("/artisans") ||
            requestPath.startsWith("/api/clients") || requestPath.startsWith("/clients") ||
            requestPath.startsWith("/api/client") || requestPath.startsWith("/client") ||
            requestPath.startsWith("/api/reviews") || requestPath.startsWith("/reviews") ||
            requestPath.startsWith("/api/services/debug") || requestPath.startsWith("/services/debug") ||
            requestPath.startsWith("/api/services/pending") || requestPath.startsWith("/services/pending") ||
            requestPath.startsWith("/api/service-categories") || requestPath.startsWith("/service-categories")) {
            System.out.println("JWT Filter - Skipping authentication for public endpoint: " + requestPath);
            filterChain.doFilter(request, response);
            return;
        }
        
        System.out.println("JWT Filter - Processing authentication for: " + requestPath);
        
        String username = null;
        String jwt = null;
        
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(jwt);
            } catch (Exception e) {
                logger.error("Unable to extract JWT token", e);
            }
        }
        
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
            
            if (jwtUtil.validateToken(jwt, userDetails)) {
                // Extraire les authorities du token JWT
                List<SimpleGrantedAuthority> authorities = null;
                try {
                    Object authoritiesClaim = jwtUtil.extractAllClaims(jwt).get("authorities");
                    if (authoritiesClaim instanceof List) {
                        authorities = ((List<?>) authoritiesClaim).stream()
                                .map(authority -> new SimpleGrantedAuthority(authority.toString()))
                                .collect(Collectors.toList());
                    }
                } catch (Exception e) {
                    System.err.println("Error extracting authorities from JWT: " + e.getMessage());
                }
                
                // Si aucune autorité dans le token, utiliser celles du UserDetails
                if (authorities == null || authorities.isEmpty()) {
                    authorities = userDetails.getAuthorities().stream()
                            .map(authority -> new SimpleGrantedAuthority(authority.getAuthority()))
                            .collect(Collectors.toList());
                }
                
                UsernamePasswordAuthenticationToken authenticationToken = 
                    new UsernamePasswordAuthenticationToken(
                        userDetails, null, authorities);
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                
                System.out.println("JWT Authentication successful for user: " + username + 
                    " with authorities: " + authorities);
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
