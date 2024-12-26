package com.example.bs.service;

import com.example.bs.models.User;
import java.util.List;

public interface UserService {

    User findByUsername(String username);

    List<User> readAllUsers();

    User readUserById(Long id);

    void saveUser(User user);

    void updateUser(Long id, User user);

    void deleteUser(Long id);
}