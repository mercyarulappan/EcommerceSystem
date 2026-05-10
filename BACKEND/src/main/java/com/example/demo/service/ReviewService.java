package com.example.demo.service;

import com.example.demo.dto.ReviewRequest;
import com.example.demo.model.Orders;
import com.example.demo.model.Product;
import com.example.demo.model.Review;
import com.example.demo.model.Users;
import com.example.demo.repository.OrdersRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.ReviewRepository;
import com.example.demo.repository.UsersRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UsersRepository usersRepository;
    private final ProductRepository productRepository;
    private final OrdersRepository ordersRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         UsersRepository usersRepository,
                         ProductRepository productRepository,
                         OrdersRepository ordersRepository) {
        this.reviewRepository = reviewRepository;
        this.usersRepository = usersRepository;
        this.productRepository = productRepository;
        this.ordersRepository = ordersRepository;
    }

    // CREATE
//    public Review addReview(Review review) {
//
//        Long orderId = review.getOrder().getId();
//
//        // 🔴 Prevent duplicate per order
//        Review existing = reviewRepository.findByOrder_Id(orderId).orElse(null);
//
//        if (existing != null) {
//            throw new RuntimeException("Review already exists for this order");
//        }
//
//        Users user = usersRepository.findById(review.getUsers().getId())
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        Product product = productRepository.findById(review.getProduct().getId())
//                .orElseThrow(() -> new RuntimeException("Product not found"));
//
//        Orders orderEntity = ordersRepository.findById(orderId)
//                .orElseThrow(() -> new RuntimeException("Order not found"));
//
//        review.setUsers(user);
//        review.setProduct(product);
//        review.setOrder(orderEntity);
//
//        return reviewRepository.save(review);
//    }

    public Review addReview(ReviewRequest request, String email) {

        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        List<Orders> orders = ordersRepository
                .findByOrderGroupId(request.getOrderGroupId());

        if (orders.isEmpty()) {
            throw new RuntimeException("Invalid Order");
        }

        // ✅ Find correct order item for this product
        Orders order = orders.stream()
                .filter(o -> o.getProduct().getId().equals(product.getId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Product not in this order"));

        // ✅ Check order belongs to user
        if (!order.getUsers().getId().equals(user.getId())) {
            throw new RuntimeException("Order does not belong to user");
        }

        // ✅ Allow review only if delivered
        if (!order.getOrderStatus().equalsIgnoreCase("DELIVERED")) {
            throw new RuntimeException("You can review only delivered products");
        }

        // ✅ Prevent duplicate review
        if (reviewRepository.findByOrder_Id(order.getId()).isPresent()) {
            throw new RuntimeException("Review already exists for this order");
        }

        // ✅ Create review
        Review review = new Review();
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setUsers(user);
        review.setProduct(product);
        review.setOrder(order);

        order.setIsReviewed(true);
        ordersRepository.save(order); // IMPORTANT

        Review savedReview = reviewRepository.save(review);

        // ✅ Update product rating
        updateProductRating(product);

        return savedReview;
    }
    // UPDATE
//    public Review addOrUpdateReview(Review review) {
//
//        Long userId = review.getUsers().getId();
//        Long productId = review.getProduct().getId();
//
//        Review existing = reviewRepository
//                .findByUsers_IdAndProduct_Id(userId, productId)
//                .orElse(null);
//
//        if (existing != null) {
//            existing.setRating(review.getRating());
//            existing.setComment(review.getComment());
//            return reviewRepository.save(existing);
//        }
//
//        return addReview(review); // reuse logic
//    }
    public void updateProductRating(Product product) {

        List<Review> reviews = reviewRepository.findByProduct_Id(product.getId());

        double avg = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        product.setRatingAvg(avg);
        product.setRatingCount((double) reviews.size());

        productRepository.save(product);
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public Review getReviewById(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
    }

    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }
}