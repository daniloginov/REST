package ru.kata.spring.boot_security.demo.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repository.UserRepository;

import javax.naming.AuthenticationException;
import javax.persistence.EntityNotFoundException;
import java.util.List;

@Service
@Transactional
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    @Override
    public User getUser(long id) {
        if (!userRepository.existsById(id)) {
            throw new EntityNotFoundException();
        }

        return userRepository.getById(id);
    }

    @Override
    public User deleteUser(long id) {
        if (!userRepository.existsById(id)) {
            throw new EntityNotFoundException();
        }
        User user = null;
        try {
            userRepository.deleteById(id);
            user = null;
        } catch (NullPointerException e) {
            e.printStackTrace();
        }
        return user;
    }

    @Override
    public void createUser(User user) throws AuthenticationException {
        if (findByUsername(user.getUsername()) != null) {
            throw new AuthenticationException();
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    @Override
    public void updateUser(User user) throws AuthenticationException {
        if ((findByUsername(user.getUsername()) != null)
                && findByUsername(user.getUsername()).getId() != user.getId()) {
            throw new AuthenticationException();
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}