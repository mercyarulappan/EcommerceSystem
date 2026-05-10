package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderRequest {

    private Long userId;
    private Long productId;
    private Integer quantity;
    private String address;

}