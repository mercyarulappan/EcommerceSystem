package com.example.demo.service;
import com.example.demo.exception.BadRequestException;
import com.example.demo.model.Cart;
import com.example.demo.model.Product;
import com.example.demo.model.Users;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UsersRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UsersRepository usersRepository;
    // Constructor injection
    public CartService(CartRepository cartRepository,ProductRepository productRepository,UsersRepository usersRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.usersRepository = usersRepository;
    }

    // CREATE
//    public Cart addToCart(Cart cart) {
//
//        if (cart.getQuantity() <= 0) {
//            throw new BadRequestException("Quantity must be greater than 0");
//        }
//
//        Long userId = cart.getUsers().getId();
//        Long productId = cart.getProduct().getId();
//
//        // ✅ LOAD FULL USER
//        Users user = usersRepository.findById(userId)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        // ✅ LOAD FULL PRODUCT
//        Product product = productRepository.findById(productId)
//                .orElseThrow(() -> new RuntimeException("Product not found"));
//
//        Optional<Cart> existingCart =
//                cartRepository.findByUsers_IdAndProduct_Id(userId, productId);
//
//        if (existingCart.isPresent()) {
//            Cart oldCart = existingCart.get();
//            oldCart.setQuantity(oldCart.getQuantity() + cart.getQuantity());
//            oldCart.setUpdatedAt(LocalDateTime.now());
//            return cartRepository.save(oldCart);
//        }
//
//        // 🆕 new insert
//        cart.setUsers(user);          // ✅ FULL USER
//        cart.setProduct(product);    // ✅ FULL PRODUCT
//        cart.setPriceAtAdded(product.getPrice());
//
//        return cartRepository.save(cart);
//    }

    public Cart addProductToUserCart(String email, Long productId) {

        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<Cart> existingCartItem =
                cartRepository.findByUsersAndProduct(user, product);

        if (existingCartItem.isPresent()) {

            Cart cart = existingCartItem.get();
            cart.setQuantity(cart.getQuantity() + 1);   // 🔥 increase quantity
            return cartRepository.save(cart);

        } else {

            Cart cart = new Cart();
            cart.setUsers(user);
            cart.setProduct(product);
            cart.setQuantity(1);

            return cartRepository.save(cart);
        }
    }
    public List<Cart> getCartByUser(String email) {

        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return cartRepository.findByUsers(user);
    }

    public void removeFromUserCart(String email, Long cartId) {

        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (!cart.getUsers().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized action");
        }

        cartRepository.delete(cart);
    }



    // READ ALL
    public List<Cart> getAllCartItems() {
        return cartRepository.findAll();
    }

    // READ BY ID
    public Cart getCartById(Long id) {
        return cartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart item not found with id: " + id));
    }

    // UPDATE
    public Cart updateCart(Cart cart) {

        Cart existingCart = cartRepository.findById(cart.getId())
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (cart.getQuantity() <= 0) {
            throw new BadRequestException("Quantity must be greater than 0");
        }

        // DO NOT change user & product (avoids duplicate key error)
        existingCart.setQuantity(cart.getQuantity());
        existingCart.setPriceAtAdded(cart.getPriceAtAdded());

        existingCart.setUpdatedAt(LocalDateTime.now());

        return cartRepository.save(existingCart);
    }
    public Cart updateCartQuantity(Long id, int quantity) {
        Cart cart = cartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.setQuantity(quantity);
        return cartRepository.save(cart);
    }
    public int getCartCountByUser(String email) {
        return cartRepository.countByUsers_Email(email);
    }




    // DELETE
    public void removeFromCart(Long id) {
        cartRepository.deleteById(id);
    }
}