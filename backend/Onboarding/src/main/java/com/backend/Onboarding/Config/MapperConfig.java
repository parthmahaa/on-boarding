package com.backend.Onboarding.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.modelmapper.ModelMapper;

@Configuration
public class MapperConfig {

    @Bean
    public ModelMapper modelMapper(){
        return new ModelMapper();
    }
}
