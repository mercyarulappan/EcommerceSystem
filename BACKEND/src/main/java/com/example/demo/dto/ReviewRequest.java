package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewRequest {

    private int rating;
    private String comment;
    private Long productId;
    private String orderGroupId;

    // getters and setters
}