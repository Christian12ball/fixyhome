package com.fixyhome.repository;

import com.fixyhome.model.User;
import com.fixyhome.model.UserType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    long countByUserType(UserType userType);
    
    List<User> findByUserType(UserType userType);
    
    List<User> findTop10ByOrderByCreatedAtDesc();
    
    @Query("SELECT u FROM User u WHERE u.firstName LIKE %:search% OR u.lastName LIKE %:search% OR u.email LIKE %:search%")
    List<User> searchUsers(@Param("search") String search);
}
