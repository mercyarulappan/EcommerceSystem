package com.example.demo.exception;

public class InvalidProductQuantityException extends RuntimeException {
    public InvalidProductQuantityException(String message) {
        super(message);
    }
}
