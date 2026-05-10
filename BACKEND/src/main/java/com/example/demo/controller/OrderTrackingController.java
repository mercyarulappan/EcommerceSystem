package com.example.demo.controller;

import com.example.demo.model.OrderTracking;
import com.example.demo.service.OrderTrackingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-tracking")
public class OrderTrackingController {

    private final OrderTrackingService orderTrackingService;

    public OrderTrackingController(OrderTrackingService orderTrackingService) {
        this.orderTrackingService = orderTrackingService;
    }

    // 🔥 MAIN TRACK API
    @GetMapping("/track/{groupId}")
    public List<OrderTracking> getTrackingByGroupId(@PathVariable String groupId) {
        return orderTrackingService.getByOrderGroupId(groupId);
    }

    // OPTIONAL (for admin/manual insert)
    @PostMapping("/add")
    public OrderTracking addTracking(@RequestBody OrderTracking orderTracking) {
        return orderTrackingService.save(orderTracking);
    }
}