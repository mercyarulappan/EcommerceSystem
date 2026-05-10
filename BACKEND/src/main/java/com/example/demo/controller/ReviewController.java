package com.example.demo.controller;

import com.example.demo.dto.ReviewRequest;
import com.example.demo.model.Review;
import com.example.demo.service.ReviewService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // ✅ CREATE
    @PostMapping
    public Review addReview(
            @RequestBody ReviewRequest request,
            Authentication authentication) {

        String email = authentication.getName();
        return reviewService.addReview(request, email);
    }

    // ✅ READ ALL
    @GetMapping
    public List<Review> getAllReviews() {
        return reviewService.getAllReviews();
    }

    // ✅ READ BY ID
    @GetMapping("/{id}")
    public Review getReviewById(@PathVariable Long id) {
        return reviewService.getReviewById(id);
    }

    // ✅ UPDATE
//    @PutMapping("/{id}")
//    public Review updateReview(@PathVariable Long id, @RequestBody Review review) {
//        review.setId(id);
//        return reviewService.addOrUpdateReview(review);
//    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public String deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return "Review deleted successfully";
    }
}