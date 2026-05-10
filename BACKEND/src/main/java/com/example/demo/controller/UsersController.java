package com.example.demo.controller;

import com.example.demo.dto.ChangePasswordRequest;
import com.example.demo.model.Orders;
import com.example.demo.model.Product;
import com.example.demo.model.Users;
import com.example.demo.service.OrdersService;
import com.example.demo.service.ProductService;
import com.example.demo.service.UsersService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UsersController {
    private final ProductService productService;
    private final OrdersService ordersService;
    private final UsersService usersService;
    public UsersController(ProductService productService,
                           OrdersService ordersService,
                           UsersService usersService) {
        this.productService = productService;
        this.ordersService = ordersService;
        this.usersService = usersService;
    }
    @PostMapping("/users/add")
    public Users addUser(@RequestBody Users users){
        return usersService.save(users);
    }

    @GetMapping("/users/{id}")
    public Users getUserById(@PathVariable Long id){
        return usersService.getUserById(id);
    }

    @PutMapping("/users/{id}")
    public Users updateUser(@PathVariable Long id, @RequestBody Users users){
        users.setId(id);
        return usersService.updateUser(users);
    }
    @GetMapping("/users/profile")
    public Users getProfile(Authentication authentication){
        String email = authentication.getName();
        return usersService.getUserByEmail(email);
    }
    @PutMapping("/users/profile")
    public Users updateProfile(Authentication authentication,@RequestBody Users users){
        String email = authentication.getName();
        return usersService.updateProfile(email,users);
    }

    @PutMapping("/users/change-password")
    public String changePassword(Authentication authentication,
                                 @RequestBody ChangePasswordRequest request){

        String email = authentication.getName();

        usersService.changePassword(
                email,
                request.getOldPassword(),
                request.getNewPassword()
        );

        return "Password updated successfully";
    }

    // GET ALL USERS (ADMIN)
    @GetMapping("/admin/users/")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Users> getAllUsers(){
        return usersService.getAllUsers();
    }

    // DELETE USER (ADMIN)
    @DeleteMapping("/admin/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteUserById(@PathVariable Long id){
        usersService.deleteUserById(id);
        return ResponseEntity.ok("User Deleted Successfully!");
    }






    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/products/{id}")
    public String deleteProduct(@PathVariable Long id){
        productService.deleteProduct(id);
        return "Product deleted successfully";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/products")
    public List<Product> getAllProducts(){
        return productService.getAllProducts();
    }

    // ------------------- Orders -------------------





}