package com.example.demo.dto;


import com.example.demo.model.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    private String name;
    private String password;
    private Role role;
    private String email;

    // getters and setters
}
