package com.backend.Onboarding.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UrlDTO {
    private String urlToken;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm dd-MMM-yy")
    private LocalDateTime createdAt;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm dd-MMM-yy")
    private LocalDateTime updatedAt;
}
