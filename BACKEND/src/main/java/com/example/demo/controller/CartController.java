package com.example.demo.controller;
import com.example.demo.dto.CartUpdateRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import com.example.demo.model.Cart;
import com.example.demo.service.CartService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3000")

public class CartController {

    private final CartService cartService;

    // Constructor injection (recommended)
    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // CREATE
    @PostMapping("/add/{productId}")
    public Cart addToCart(
            @PathVariable Long productId,
            Authentication authentication
    ) {
        String email = authentication.getName();

        return cartService.addProductToUserCart(email, productId);
    }



    // READ ALL
    @GetMapping
    public List<Cart> getUserCart(Authentication authentication) {
        String email = authentication.getName();
        return cartService.getCartByUser(email);
    }
    // READ BY ID
    @GetMapping("/{id}")
    public Cart getCartById(@PathVariable Long id) {
        return cartService.getCartById(id);
    }

    // UPDATE
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public Cart updateCartItem(@PathVariable Long id, @RequestBody Cart cart) {
        cart.setId(id);
        return cartService.updateCart(cart);
    }


    @GetMapping("/count")
    public ResponseEntity<Integer> getCartCount(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(cartService.getCartCountByUser(email));
    }








    // DELETE
    @DeleteMapping("/{id}")
    public String deleteCartItem(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String email = authentication.getName();
        cartService.removeFromUserCart(email, id);
        return "Cart Item Deleted Successfully!";
    }
}