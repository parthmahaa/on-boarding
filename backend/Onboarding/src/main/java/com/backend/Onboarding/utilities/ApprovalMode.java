package com.backend.Onboarding.utilities;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ApprovalMode {
    MODE_A("Mode A"),
    MODE_B("Mode B"),
    MODE_C("Mode C");

    private final String value;

    ApprovalMode(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static ApprovalMode fromValue(String value) {
        for (ApprovalMode mode : ApprovalMode.values()) {
            if (mode.value.equalsIgnoreCase(value)) {
                return mode;
            }
        }
        throw new IllegalArgumentException("Invalid approval mode: " + value);
    }

    @Override
    public String toString() {
        return value;
    }
}