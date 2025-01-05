package ru.kata.spring.boot_security.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.repositories.UserRepository;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userDao;

    @Autowired
    public UserServiceImpl(UserRepository userDao, PasswordEncoder passwordEncoder) {
        this.userDao = userDao;
        this.passwordEncoder = passwordEncoder;

    }

    @Override
    public User findUserById(Long userId) {
        Optional<User> userFromDb = userDao.findById(userId);
        return userFromDb.orElse(new User());
    }

    @Override
    public List<User> findAllUsers() {
        return userDao.findAll();
    }

    @Override
    @Transactional
    public void saveUser(User user) {
        user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
        user.setRoles(user.getRoles());
        userDao.save(user);
    }

    @Override
    @Transactional
    public boolean updateUser(Long id, User updatedUser) {
        Optional<User> userFromDb = userDao.findById(id);
        if (userFromDb.isPresent()) {
            User existingUser = userFromDb.get();
            // Обновляем поля пользователя
            existingUser.setFirstName(updatedUser.getFirstName());
            existingUser.setLastName(updatedUser.getLastName());
            existingUser.setEmail(updatedUser.getEmail());
            existingUser.setAge(updatedUser.getAge());
            existingUser.setRoles(updatedUser.getRoles());
            // Обновляем пароль, если он был изменен
            if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
            }
            userDao.save(existingUser);
            return true;
        }
        return false;
    }

    @Override
    @Transactional
    public boolean deleteUser(Long userId) {
        if (userDao.findById(userId).isPresent()) {
            userDao.deleteById(userId);
            return true;
        }
        return false;
    }

    @Override
    public User findByEmail(String email) {
        return userDao.findByEmail(email);
    }
}