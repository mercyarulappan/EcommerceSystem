package com.example.demo.repository;

import com.example.demo.model.Orders;
import com.example.demo.model.Product;
import com.example.demo.model.Users;
import org.apache.catalina.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrdersRepository extends JpaRepository<Orders,Long> {
    void deleteByUsers_Id(Long usersId);

    List<Orders> findByOrderGroupId(String orderGroupId);
    List<Orders> findByUsers(Users user);
    boolean existsByProduct(Product product);
}
