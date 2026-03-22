package com.fixyhome.service;

import com.fixyhome.model.Contact;
import com.fixyhome.repository.ContactRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactService {
    
    private final ContactRepository contactRepository;
    
    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }
    
    public Contact createContact(Contact contact) {
        return contactRepository.save(contact);
    }
    
    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }
    
    public Contact getContactById(Long id) {
        return contactRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Contact non trouvé"));
    }
    
    public Contact updateContactStatus(Long id, String status) {
        Contact contact = getContactById(id);
        contact.setStatus(status);
        return contactRepository.save(contact);
    }
    
    public List<Contact> getPendingContacts() {
        return contactRepository.findByStatus("PENDING");
    }
    
    public List<Contact> getContactsByType(String contactType) {
        return contactRepository.findByContactType(contactType);
    }
}
