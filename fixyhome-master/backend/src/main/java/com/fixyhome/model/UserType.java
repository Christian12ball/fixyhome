package com.fixyhome.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum UserType {
    CLIENT,
    ARTISAN,
    ADMIN;

    @JsonCreator
    public static UserType fromString(String value) {
        if (value == null) {
            return null;
        }
        return UserType.valueOf(value.toUpperCase());
    }

    @JsonValue
    public String toValue() {
        return this.name().toLowerCase();
    }
}
