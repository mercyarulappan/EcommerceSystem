package com.example.demo.service;

import com.example.demo.model.Users;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.OrdersRepository;
import com.example.demo.repository.ReviewRepository;
import com.example.demo.repository.UsersRepository;
import jakarta.transaction.Transactional;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsersService {

    private final PasswordEncoder passwordEncoder;
    private final UsersRepository usersRepository;
    private final CartRepository cartRepository;
    private final OrdersRepository ordersRepository;
    private final ReviewRepository reviewRepository;
    public UsersService(ReviewRepository reviewRepository, CartRepository cartRepository, OrdersRepository ordersRepository,PasswordEncoder passwordEncoder,UsersRepository usersRepository) {
        this.cartRepository = cartRepository;
        this.ordersRepository = ordersRepository;
        this.reviewRepository = reviewRepository;
        this.passwordEncoder = passwordEncoder;
        this.usersRepository = usersRepository;
    }

    public Users save(Users users){
        return usersRepository.save(users);
    }
    public List<Users> getAllUsers(){
        return usersRepository.findAll();
    }
    public Users getUserById(Long id){
        return usersRepository.findById(id).orElseThrow(()-> new RuntimeException("User not found with id: " + id));
    }
    public  Users getUserByEmail(String email){
        return usersRepository.findByEmail(email).orElseThrow(()-> new RuntimeException("User not found with this mail id: "+email));
    }
    @Transactional
    public void deleteUserById(Long id){
        reviewRepository.deleteByOrder_Users_Id(id);
        ordersRepository.deleteByUsers_Id(id);
        cartRepository.deleteByUsers_Id(id);
        usersRepository.deleteById(id);
    }
    public Users updateUser(Users users){
        Users existingUser = usersRepository.findById(users.getId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + users.getId()));

        existingUser.setName(users.getName());
        existingUser.setEmail(users.getEmail());
        existingUser.setPassword(users.getPassword());

        return usersRepository.save(existingUser);
    }

    public Users updateProfile(String email, Users updatedUser){
        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with this email" + email));

        user.setName(updatedUser.getName());
        return usersRepository.save(user);
    }
    public void changePassword(String email,
                               String oldPassword,
                               String newPassword){

        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(!passwordEncoder.matches(oldPassword, user.getPassword())){
            throw new RuntimeException("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));

        usersRepository.save(user);
    }




}