package com.example.demo.service;

import com.example.demo.model.OrderTracking;
import com.example.demo.repository.OrderTrackingRepository;
import com.example.demo.repository.OrdersRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderTrackingService {

    private final OrderTrackingRepository orderTrackingRepository;

    public OrderTrackingService(OrderTrackingRepository orderTrackingRepository) {
        this.orderTrackingRepository = orderTrackingRepository;
    }

    // CREATE tracking entry
    public OrderTracking save(OrderTracking orderTracking) {
        return orderTrackingRepository.save(orderTracking);
    }

    // GET tracking by groupId (MAIN LOGIC)
    public List<OrderTracking> getByOrderGroupId(String groupId) {
        return orderTrackingRepository
                .findAllByOrderGroupIdOrderByCreatedAtAsc(groupId);
    }
}