package com.fixyhome.controller;

import com.fixyhome.model.Contact;
import com.fixyhome.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/contacts")
@CrossOrigin(origins = "http://localhost:3000")
public class ContactController {
    
    private final ContactService contactService;
    
    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }
    
    @PostMapping
    public ResponseEntity<Contact> createContact(@Valid @RequestBody Contact contact) {
        Contact created = contactService.createContact(contact);
        return ResponseEntity.status(201).body(created);
    }
    
    @GetMapping
    public ResponseEntity<java.util.List<Contact>> getAllContacts() {
        java.util.List<Contact> contacts = contactService.getAllContacts();
        return ResponseEntity.ok(contacts);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Contact> getContactById(@PathVariable Long id) {
        Contact contact = contactService.getContactById(id);
        return ResponseEntity.ok(contact);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<Contact> updateContactStatus(
            @PathVariable Long id,
            @RequestBody String status) {
        Contact updated = contactService.updateContactStatus(id, status);
        return ResponseEntity.ok(updated);
    }
}
