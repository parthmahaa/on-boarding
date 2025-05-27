package com.backend.Onboarding.Config;

import com.backend.Onboarding.DTO.CompanyAdminDTO;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseWrapper<T> {

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm dd-MMM-yy")
    private LocalDateTime time;
    private int status;
    private String message;
    private T data;
    private boolean isError;
}
