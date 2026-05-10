package com.example.demo.repository;

import com.example.demo.model.Category;
import com.example.demo.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product,Long> {
    List<Product> findByCategory(String category);
    List<Product> findByCategory_Id(Long categoryId);
    List<Product> findByIsActiveTrue();
    List<Product> findTop5ByCategoryAndIdNot(Category category, Long id);
}
