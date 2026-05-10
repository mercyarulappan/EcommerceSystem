package com.example.demo.service;

import com.example.demo.model.*;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.OrdersRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UsersRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrdersService {

    private final CartRepository cartRepository;
    private final OrdersRepository ordersRepository;
    private final UsersRepository usersRepository;
    private final ProductRepository productRepository;
    private final OrderTrackingService orderTrackingService;

    public OrdersService(OrdersRepository ordersRepository,
                         ProductRepository productRepository,
                         UsersRepository usersRepository,
                         CartRepository cartRepository,
                         OrderTrackingService orderTrackingService) {

        this.ordersRepository = ordersRepository;
        this.productRepository = productRepository;
        this.usersRepository = usersRepository;
        this.cartRepository = cartRepository;
        this.orderTrackingService = orderTrackingService;
    }

    // ✅ PLACE SINGLE PRODUCT ORDER
    public Orders placeOrder(String email, Long productId, Integer quantity, String address) {

        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Orders order = new Orders();
        order.setUsers(user);
        order.setProduct(product);
        order.setQuantity(quantity);
        order.setAddress(address);

        order.setPrice(
                product.getPrice().multiply(BigDecimal.valueOf(quantity))
        );

        order.setOrderStatus("PLACED");
        order.setIsReviewed(false);

        String groupId = "ORD" + System.currentTimeMillis();
        order.setOrderGroupId(groupId);

        Orders savedOrder = ordersRepository.save(order);

        // 🔥 ADD TRACKING ENTRY
        OrderTracking tracking = new OrderTracking();
        tracking.setOrderGroupId(groupId);
        tracking.setStatus("PLACED");
        tracking.setDescription("Order placed successfully");
        tracking.setLocation("Chennai");
        tracking.setUpdatedBy("SYSTEM");

        orderTrackingService.save(tracking);

        return savedOrder;
    }

    // ✅ GET ALL ORDERS (ADMIN)
    public List<Orders> getAllOrders() {
        return ordersRepository.findAll();
    }

    // ✅ GET ORDER BY ID
    public Orders getOrderById(Long id) {
        return ordersRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Order not found with id: " + id));
    }

    // ✅ UPDATE ORDER
    public Orders updateOrder(Orders order) {

        Orders existingOrder = ordersRepository.findById(order.getId())
                .orElseThrow(() ->
                        new RuntimeException("Order not found with id: " + order.getId()));

        Users user = usersRepository.findById(order.getUsers().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(order.getProduct().getId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        existingOrder.setUsers(user);
        existingOrder.setProduct(product);
        existingOrder.setQuantity(order.getQuantity());
        existingOrder.setPrice(order.getPrice());
        existingOrder.setOrderStatus(order.getOrderStatus());

        if (order.getOrderGroupId() != null) {
            existingOrder.setOrderGroupId(order.getOrderGroupId());
        }

        if (order.getIsReviewed() != null) {
            existingOrder.setIsReviewed(order.getIsReviewed());
        }

        return ordersRepository.save(existingOrder);
    }

    // ✅ GET USER ORDERS
    public List<Orders> getOrdersByUser(String email) {

        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ordersRepository.findByUsers(user);
    }

    // ✅ UPDATE ORDER STATUS (ADMIN)
    public List<Orders> updateOrderStatus(Long id, String status) {

        Orders currentOrder = ordersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        List<Orders> orders = ordersRepository
                .findByOrderGroupId(currentOrder.getOrderGroupId());

        if (orders.isEmpty()) {
            throw new RuntimeException("No orders found");
        }

        // Prevent duplicate update
        if (orders.get(0).getOrderStatus().equalsIgnoreCase(status)) {
            throw new RuntimeException("Order is already " + status);
        }

        // Prevent final state updates
        if (orders.get(0).getOrderStatus().equalsIgnoreCase("DELIVERED") ||
                orders.get(0).getOrderStatus().equalsIgnoreCase("CANCELLED")) {
            throw new RuntimeException("Order cannot be updated");
        }

        for (Orders order : orders) {
            order.setOrderStatus(status);
        }

        List<Orders> updatedOrders = ordersRepository.saveAll(orders);

        // Save only one tracking row
        OrderTracking tracking = new OrderTracking();
        tracking.setOrderGroupId(currentOrder.getOrderGroupId());
        tracking.setStatus(status);
        tracking.setDescription("Order " + status);
        tracking.setLocation("System Update");
        tracking.setUpdatedBy("SYSTEM");

        orderTrackingService.save(tracking);

        return updatedOrders;
    }
    public Orders updateOrderStatusByAdmin(Long id, String status) {

        Orders order = ordersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Optional validation
        if (!List.of("PENDING", "SHIPPED", "DELIVERED").contains(status)) {
            throw new RuntimeException("Invalid status");
        }

        order.setOrderStatus(status);
        return ordersRepository.save(order);
    }

    // ✅ CART CHECKOUT
    public void checkoutCart(String email, String address) {

        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Cart> cartItems = cartRepository.findByUsers(user);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        String groupId = "ORD" + System.currentTimeMillis();

        for (Cart item : cartItems) {

            Orders order = new Orders();

            order.setUsers(user);
            order.setProduct(item.getProduct());
            order.setQuantity(item.getQuantity());
            order.setAddress(address);

            order.setPrice(
                    item.getProduct().getPrice()
                            .multiply(BigDecimal.valueOf(item.getQuantity()))
            );

            order.setOrderStatus("PLACED");
            order.setIsReviewed(false);
            order.setOrderGroupId(groupId);

            ordersRepository.save(order);
        }

        // 🔥 SINGLE TRACKING ENTRY FOR CART ORDER
        OrderTracking tracking = new OrderTracking();
        tracking.setOrderGroupId(groupId);
        tracking.setStatus("PLACED");
        tracking.setDescription("Cart order placed successfully");
        tracking.setLocation("Chennai");
        tracking.setUpdatedBy("SYSTEM");

        orderTrackingService.save(tracking);

        cartRepository.deleteAll(cartItems);
    }

    // ✅ DELETE ORDER
    public void deleteOrder(Long id) {
        ordersRepository.deleteById(id);
    }
}