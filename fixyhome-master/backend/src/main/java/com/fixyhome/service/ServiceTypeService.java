package com.fixyhome.service;

import com.fixyhome.model.ServiceType;
import com.fixyhome.repository.ServiceTypeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ServiceTypeService {
    
    private final ServiceTypeRepository serviceTypeRepository;
    
    public ServiceTypeService(ServiceTypeRepository serviceTypeRepository) {
        this.serviceTypeRepository = serviceTypeRepository;
    }
    
    public List<ServiceType> getAllServices() {
        return serviceTypeRepository.findActiveServices();
    }
    
    public List<ServiceType> getServicesByCategoryName(String categoryName) {
        return serviceTypeRepository.findActiveServicesByCategory(categoryName);
    }
    
    public List<ServiceType> getServicesByCategoryId(Long categoryId) {
        return serviceTypeRepository.findActiveServicesByCategoryId(Math.toIntExact(categoryId));
    }
    
    public Optional<ServiceType> getServiceById(Long id) {
        return serviceTypeRepository.findById(id);
    }
    
    public ServiceType createService(ServiceType serviceType) {
        serviceType.setIsActive(true);
        return serviceTypeRepository.save(serviceType);
    }
    
    public ServiceType updateService(ServiceType serviceType) {
        return serviceTypeRepository.save(serviceType);
    }
    
    public void deleteService(Long id) {
        Optional<ServiceType> service = serviceTypeRepository.findById(id);
        if (service.isPresent()) {
            service.get().setIsActive(false);
            serviceTypeRepository.save(service.get());
        }
    }
    
    public long countActiveServices() {
        return serviceTypeRepository.countActiveServices();
    }
}
