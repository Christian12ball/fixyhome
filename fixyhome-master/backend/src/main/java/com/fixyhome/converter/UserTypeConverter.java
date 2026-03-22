package com.fixyhome.converter;

import com.fixyhome.model.UserType;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class UserTypeConverter implements AttributeConverter<UserType, String> {

    @Override
    public String convertToDatabaseColumn(UserType userType) {
        if (userType == null) {
            return null;
        }
        return userType.name(); // Retourne "CLIENT" ou "ARTISAN"
    }

    @Override
    public UserType convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return UserType.valueOf(dbData); // Convertit "CLIENT" ou "ARTISAN" en enum
    }
}
