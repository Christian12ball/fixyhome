package com.fixyhome.repository;

import com.fixyhome.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
    
    List<Contact> findByStatus(String status);
    
    List<Contact> findByContactType(String contactType);
    
    List<Contact> findByStatusAndContactType(String status, String contactType);
}
