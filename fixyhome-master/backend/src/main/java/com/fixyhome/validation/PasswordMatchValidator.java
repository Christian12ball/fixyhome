package com.fixyhome.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import com.fixyhome.dto.RegisterRequest;

public class PasswordMatchValidator implements ConstraintValidator<PasswordMatch, RegisterRequest> {

    @Override
    public boolean isValid(RegisterRequest registerRequest, ConstraintValidatorContext context) {
        if (registerRequest == null) {
            return true;
        }
        
        String password = registerRequest.getPassword();
        String confirmPassword = registerRequest.getConfirmPassword();
        
        if (password == null || confirmPassword == null) {
            return true; // Laisser les annotations @NotBlank gérer ça
        }
        
        boolean isValid = password.equals(confirmPassword);
        
        if (!isValid) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("Les mots de passe ne correspondent pas")
                   .addPropertyNode("confirmPassword")
                   .addConstraintViolation();
        }
        
        return isValid;
    }
}
