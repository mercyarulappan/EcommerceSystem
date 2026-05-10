package com.example.demo.controller;

import com.example.demo.dto.OrderRequest;
import com.example.demo.dto.CartCheckoutRequest;
import com.example.demo.dto.OrderStatusUpdateRequest;
import com.example.demo.model.Orders;
import com.example.demo.service.OrdersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrdersController {

    @Autowired
    private OrdersService ordersService;

    // PLACE SINGLE ORDER
    @PostMapping("/addorder")
    public Orders placeOrder(@RequestBody OrderRequest request, Authentication authentication) {

        String email = authentication.getName();

        return ordersService.placeOrder(
                email,
                request.getProductId(),
                request.getQuantity(),
                request.getAddress()
        );
    }

    // USER ORDER HISTORY
    @GetMapping("/myorders")
    public List<Orders> getMyOrders(Authentication authentication) {

        String email = authentication.getName();

        return ordersService.getOrdersByUser(email);
    }

    // GET ORDER BY ID
    @GetMapping("/{id}")
    public Orders getOrderById(@PathVariable Long id) {
        return ordersService.getOrderById(id);
    }



    // UPDATE ORDER
    @PutMapping("/{id}")
    public Orders updateOrder(@PathVariable Long id,
                              @RequestBody Orders order) {

        order.setId(id);

        return ordersService.updateOrder(order);
    }

    // CANCEL ORDER
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(
                    ordersService.updateOrderStatus(id, "CANCELLED")
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    // CART CHECKOUT
    @PostMapping("/cart-checkout")
    public String checkoutCart(Authentication authentication,
                               @RequestBody CartCheckoutRequest request) {


        String email = authentication.getName();

        ordersService.checkoutCart(email, request.getAddress());

        return "Order placed successfully";
    }
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public Orders updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status   // ✅ IMPORTANT
    ) {
        return ordersService.updateOrderStatusByAdmin(id, status);
    }

    // ✅ GET ALL ORDERS (for admin)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Orders> getAllOrders() {
        return ordersService.getAllOrders();
    }
}