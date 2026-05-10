package com.example.demo.config;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "du7fnd0hl",
                "api_key", "154857221439756",
                "api_secret", "RoUJudzAPgFddk7E_ZY5LavcxRI"
        ));
    }
}
