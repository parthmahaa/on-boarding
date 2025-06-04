package com.backend.Onboarding.Config;

import com.backend.Onboarding.Config.Exceptions.SmtpConfigNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalResponseHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ResponseWrapper<Object>> handleValidationException(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getFieldError().getDefaultMessage();
        ResponseWrapper<Object> response = new ResponseWrapper<>(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                errorMessage,
                null,
                true
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseWrapper<Object>> handleGenericException(Exception ex) {
        ResponseWrapper<Object> response = new ResponseWrapper<>(
                LocalDateTime.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                ex.getMessage(),
                null,
                true
        );
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ResponseWrapper<Object>> handleArgumentException(IllegalArgumentException e){
        String errorMessage = e.getMessage();
        ResponseWrapper<Object> response = new ResponseWrapper<>(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                errorMessage,
                null,
                true
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(SmtpConfigNotFoundException.class)
    public ResponseEntity<?> handleSmtpConfigNotFound(SmtpConfigNotFoundException ex) {
        return new ResponseEntity<>(new ResponseWrapper<>(
                LocalDateTime.now(),
                HttpStatus.NOT_FOUND.value(),
                "SMTP Config not found",
                null,
                true
        ), HttpStatus.NOT_FOUND);
    }


}
