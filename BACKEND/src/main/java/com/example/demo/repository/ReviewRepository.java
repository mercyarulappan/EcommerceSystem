package com.example.demo.repository;

import com.example.demo.model.Product;
import com.example.demo.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review,Long> {
    void deleteByOrder_Users_Id(Long userId);
    Optional<Review> findByUsers_IdAndProduct_Id(Long userId, Long productId);
    Optional<Review> findByOrder_Id(Long orderId);
    List<Review> findByProduct(Product product);
    List<Review> findByProduct_Id(Long productId);


}