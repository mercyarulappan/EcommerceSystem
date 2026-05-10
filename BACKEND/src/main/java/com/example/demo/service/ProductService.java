package com.example.demo.service;

import com.example.demo.dto.ProductCreateRequest;
import com.example.demo.dto.ProductUpdateRequest;
import com.example.demo.model.Category;
import com.example.demo.model.Product;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.OrdersRepository;
import com.example.demo.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final OrdersRepository ordersRepository;
    private final CategoryRepository categoryRepository;

    // Constructor Injection
    public ProductService(ProductRepository productRepository, CartRepository cartRepository, OrdersRepository ordersRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.cartRepository = cartRepository;
        this.ordersRepository = ordersRepository;
        this.categoryRepository = categoryRepository;
    }

    // CREATE
    public Product saveProduct(Product product) {

        if (product.getCategory() != null && product.getCategory().getId() != null) {
            Category category = categoryRepository
                    .findById(product.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));

            product.setCategory(category);
        }

        return productRepository.save(product);
    }


    // UPDATE
    public Product updateProduct(Long id, Product product) {

        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        existing.setName(product.getName());
        existing.setBrand(product.getBrand());
        existing.setDescription(product.getDescription());
        existing.setPrice(product.getPrice());
        existing.setStockQuantity(product.getStockQuantity());
        existing.setSku(product.getSku());
        existing.setIsActive(product.getIsActive());
        existing.setRatingAvg(product.getRatingAvg());      // ✅ ADD
        existing.setRatingCount(product.getRatingCount()); // ✅ ADD

        // Load full category
        if (product.getCategory() != null && product.getCategory().getId() != null) {
            Category category = categoryRepository
                    .findById(product.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            existing.setCategory(category);
        }

        return productRepository.save(existing);
    }




    public List<Product> getRelatedProducts(Long productId) {
        Product currentProduct = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return productRepository.findTop5ByCategoryAndIdNot(
                currentProduct.getCategory(),
                productId
        );
    }



    public Product updateProduct(Product product){
        Product existing = productRepository.findById(product.getId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        existing.setName(product.getName());
        existing.setDescription(product.getDescription());
        existing.setPrice(product.getPrice());
        return productRepository.save(existing);
    }

    public void deleteProduct(Long id){

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setIsActive(false);

        productRepository.save(product);
    }


    public void restoreProduct(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setIsActive(true);

        productRepository.save(product);
    }

    public void permanentDelete(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (ordersRepository.existsByProduct(product)) {
            throw new RuntimeException(
                    "Cannot permanently delete product with existing orders"
            );
        }

        productRepository.delete(product);
    }
    public List<Product> getAllProducts(){

        return productRepository.findByIsActiveTrue();

    }

    // ADMIN SIDE
    public List<Product> getAllProductsAdmin() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id){
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }


    public Product updateProductPartial(Long id, ProductUpdateRequest req) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (req.getName() != null)
            product.setName(req.getName());

        if (req.getDescription() != null)
            product.setDescription(req.getDescription());

        if (req.getPrice() != null)
            product.setPrice(req.getPrice());

        if (req.getStockQuantity() != null)
            product.setStockQuantity(req.getStockQuantity());

        if (req.getBrand() != null)
            product.setBrand(req.getBrand());

        if (req.getIsActive() != null)
            product.setIsActive(req.getIsActive());

        return productRepository.save(product);
    }

    public Product createProduct(ProductCreateRequest req) {

        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Product product = new Product();
        product.setName(req.getName());
        product.setDescription(req.getDescription());
        product.setPrice(req.getPrice());
        product.setStockQuantity(req.getStockQuantity());
        product.setBrand(req.getBrand());
        product.setCategory(category);
        product.setImageUrl(req.getImageUrl());
        product.setIsActive(true);
        return productRepository.save(product);
    }

    public List<Product> getProductsByCategory(Long id) {
        return productRepository.findByCategory_Id(id);
    }
}