package com.example.demo.repository;

import com.example.demo.model.OrderTracking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderTrackingRepository extends JpaRepository<OrderTracking,Long> {
    List<OrderTracking> findAllByOrderGroupIdOrderByCreatedAtAsc(String orderGroupId);
}