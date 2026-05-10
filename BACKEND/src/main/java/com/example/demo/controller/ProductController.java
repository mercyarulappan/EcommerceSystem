package com.example.demo.controller;

import com.example.demo.dto.ProductCreateRequest;
import com.example.demo.dto.ProductUpdateRequest;
import com.example.demo.model.Product;
import com.example.demo.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    private final ProductService productService;

    // Constructor Injection (best practice)
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // READ ALL
    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }
//    public String getAllProducts() {
//        return "API Working";
//    }

    @GetMapping("/admin")
    public  List<Product> getAllProductsByAdmin(){
        return productService.getAllProductsAdmin();
    }

    // READ BY ID


    @GetMapping("/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }
    @PatchMapping("/{id}")
    public Product updateProduct(
            @PathVariable Long id,
            @RequestBody ProductUpdateRequest request
    ) {

        return productService.updateProductPartial(
                id,
                request
        );
    }



    // SOFT DELETE
    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Long id) {

        productService.deleteProduct(id);

        return "Product hidden successfully";
    }

    // RESTORE PRODUCT
    @PatchMapping("/{id}/restore")
    public String restoreProduct(@PathVariable Long id) {

        productService.restoreProduct(id);

        return "Product restored successfully";
    }

    // PERMANENT DELETE
    @DeleteMapping("/{id}/permanent")
    public String permanentDelete(@PathVariable Long id) {

        productService.permanentDelete(id);

        return "Product permanently deleted";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/add")
    public Product addProduct(@RequestBody ProductCreateRequest req) {
        return productService.createProduct(req);
    }

    @GetMapping("/category/{id}")
    public List<Product> getProductsByCategory(@PathVariable Long id) {
        return productService.getProductsByCategory(id);
    }

    @GetMapping("/{id}/related")
    public List<Product> getRelatedProducts(@PathVariable Long id) {
        return productService.getRelatedProducts(id);
    }


}