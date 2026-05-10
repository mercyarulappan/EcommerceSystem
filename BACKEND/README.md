# 🛒 E-Commerce Management System (Spring Boot)

This is a backend E-Commerce Management System built using Spring Boot, Spring Data JPA, and MySQL.  
It provides REST APIs to manage users, categories, products, cart, orders, reviews, and order tracking.

---

## 🚀 Features
- User Management  
- Category Management (with parent-child categories)  
- Product Management  
- Cart Management  
- Order Management  
- Review Management  
- Order Tracking  
- CRUD Operations (Create, Read, Update, Delete)  
- RESTful APIs  
- MySQL Database Integration  

---

## 🏗️ Tech Stack
- Java  
- Spring Boot  
- Spring Data JPA (Hibernate)  
- MySQL  
- Maven  
- Lombok  
- Git & GitHub  

---

## 📂 Project Structure
```
com.example
 ├── Controller
 ├── Model
 ├── Repository
 └── Service
```

---

## 🗂️ ER Diagram
Place your ER Diagram image here:
```
er-diagram.png
```

---

## ⚙️ Database Schema
**Database Name:** `ecommerncedb`

### Tables
- users  
- category  
- product  
- cart  
- orders  
- review  
- order_tracking  

### Relationships
- Product → Category  
- Cart → Users, Product  
- Orders → Users, Product  
- Review → Users, Product, Orders  
- Category → Category (self reference)  

---

## 🗄️ SQL Script
(Refer to project SQL script file)

---

## ⚙️ Configuration (`application.properties`)
```
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerncedb
spring.datasource.username=root
spring.datasource.password=yourpassword

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```

---

## ⚠️ Exception Handling
Centralized exception handling using `@RestControllerAdvice`.

Handled Exceptions:
| Exception | Status |
|-----------|--------|
| ResourceNotFoundException | 404 |
| BadRequestException | 400 |
| DuplicateResourceException | 409 |
| Validation Error | 400 |
| Generic Exception | 500 |

---

## 📡 API Endpoints with Request & Response

### 👤 Users

**POST /api/users/add**
Request:
```json
{ "name": "John", "email": "john@gmail.com", "password": "1234" }
```
Response:
```json
{ "id": 1, "name": "John", "email": "john@gmail.com" }
```

**GET /api/users**
Response:
```json
[ { "id": 1, "name": "John" } ]
```

**GET /api/users/{id}**
Response:
```json
{ "id": 1, "name": "John" }
```

**PUT /api/users/{id}**
Request:
```json
{ "name": "John Updated" }
```
Response:
```json
{ "id": 1, "name": "John Updated" }
```

**DELETE /api/users/{id}**
Response:
```json
{ "message": "User deleted successfully" }
```

---

### 📦 Categories

**POST /api/categories/add**
Request:
```json
{ "name": "Electronics", "description": "Devices" }
```

**GET /api/categories**
Response:
```json
[ { "id": 1, "name": "Electronics" } ]
```

**GET /api/categories/{id}**
Response:
```json
{ "id": 1, "name": "Electronics" }
```

**PUT /api/categories/{id}**
Request:
```json
{ "name": "Mobiles" }
```

**DELETE /api/categories/{id}**
Response:
```json
{ "message": "Category deleted" }
```

---

### 🛍️ Products

**POST /api/products/add**
Request:
```json
{ "name": "iPhone", "price": 1000, "stockQuantity": 10 }
```

**GET /api/products**
Response:
```json
[ { "id": 1, "name": "iPhone" } ]
```

**GET /api/products/{id}**
Response:
```json
{ "id": 1, "name": "iPhone" }
```

**PUT /api/products/{id}**
Request:
```json
{ "price": 900 }
```

**DELETE /api/products/{id}**
Response:
```json
{ "message": "Product deleted" }
```

---

### 🛒 Cart

**POST /api/cart/add**
Request:
```json
{ "userId": 1, "productId": 1, "quantity": 2 }
```

**GET /api/cart**
Response:
```json
[ { "id": 1, "quantity": 2 } ]
```

**GET /api/cart/{id}**
Response:
```json
{ "id": 1, "quantity": 2 }
```

**PUT /api/cart/{id}**
Request:
```json
{ "quantity": 3 }
```

**DELETE /api/cart/{id}**
Response:
```json
{ "message": "Cart item deleted" }
```

---

### 📑 Orders

**POST /api/orders/addorder**
Request:
```json
{ "userId": 1, "productId": 1, "quantity": 2 }
```

**GET /api/orders**
Response:
```json
[ { "id": 1, "orderStatus": "PLACED" } ]
```

**GET /api/orders/{id}**
Response:
```json
{ "id": 1, "orderStatus": "PLACED" }
```

**PUT /api/orders/{id}**
Request:
```json
{ "orderStatus": "DELIVERED" }
```

**DELETE /api/orders/{id}**
Response:
```json
{ "message": "Order deleted" }
```

---

### ⭐ Reviews

**POST /api/reviews**
Request:
```json
{ "userId": 1, "productId": 1, "rating": 5, "comment": "Good" }
```

**GET /api/reviews**
Response:
```json
[ { "id": 1, "rating": 5 } ]
```

**GET /api/reviews/{id}**
Response:
```json
{ "id": 1, "rating": 5 }
```

**PUT /api/reviews/{id}**
Request:
```json
{ "rating": 4 }
```

**DELETE /api/reviews/{id}**
Response:
```json
{ "message": "Review deleted" }
```

---

### 🚚 Order Tracking

**POST /api/order-tracking**
Request:
```json
{ "orderGroupId": "ORD123", "status": "SHIPPED" }
```

**GET /api/order-tracking**
Response:
```json
[ { "id": 1, "status": "SHIPPED" } ]
```

**GET /api/order-tracking/{id}**
Response:
```json
{ "id": 1, "status": "SHIPPED" }
```

**PUT /api/order-tracking/{id}**
Request:
```json
{ "status": "DELIVERED" }
```

**DELETE /api/order-tracking/{id}**
Response:
```json
{ "message": "Tracking deleted" }
```

---

## ▶️ How to Run
```
git clone https://github.com/EzhilsreeJ/E-Commerce.git
```
Create database:
```
CREATE DATABASE ecommerncedb;
```
Run:
```
mvn spring-boot:run
```

---

## 👨‍💻 Author
**Ezhilsree J**  
GitHub: https://github.com/EzhilsreeJ

---

## 📜 License
This project is for learning and educational purposes only.
