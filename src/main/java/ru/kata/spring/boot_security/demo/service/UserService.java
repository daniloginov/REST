package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.model.User;

import javax.naming.AuthenticationException;
import java.util.List;

public interface UserService {
    List<User> getAllUsers();

    User getUser(long id);

    User deleteUser(long id);

    void createUser(User user) throws AuthenticationException;

    void updateUser(User user) throws AuthenticationException;

    User findByUsername(String username);
}