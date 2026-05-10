package com.example.demo.repository;

import com.example.demo.model.Cart;
import com.example.demo.model.Product;
import com.example.demo.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart,Long> {
    void deleteByUsers_Id(Long userId);
    void deleteByProduct_Id(Long productId);
    List<Cart> findByUsers(Users users);
    Optional<Cart> findByUsersAndProduct(Users users, Product product);
    int countByUsers_Email(String email);
}
