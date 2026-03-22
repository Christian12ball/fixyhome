package com.fixyhome.repository;

import com.fixyhome.model.Notification;
import com.fixyhome.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByUserOrderByCreatedAtDesc(User user);
    
    @Query("SELECT n FROM Notification n WHERE n.user.email = :email AND n.read = false ORDER BY n.createdAt DESC")
    List<Notification> findUnreadByUserEmail(@Param("email") String email);
    
    @Query("SELECT n FROM Notification n WHERE n.user.email = :email ORDER BY n.createdAt DESC")
    List<Notification> findByUserEmail(@Param("email") String email);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user.email = :email AND n.read = false")
    Long countUnreadByUserEmail(@Param("email") String email);
}
