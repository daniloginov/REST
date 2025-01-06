package ru.kata.spring.boot_security.demo.configs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repository.RoleRepository;
import ru.kata.spring.boot_security.demo.repository.UserRepository;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.annotation.PostConstruct;
import java.util.Set;

@Component
public class DataInitializer {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;

    @Autowired
    public DataInitializer(UserService userService, PasswordEncoder passwordEncoder, RoleRepository roleRepository, UserRepository userRepository) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    @PostConstruct
    public void loadTestUsers() {
        Role userRole = new Role("ROLE_USER");
        Role adminRole = new Role("ROLE_ADMIN");

        roleRepository.save(userRole);
        roleRepository.save(adminRole);

        User user = new User("UserName", "UserSurname", 25, "username", passwordEncoder.encode("userpassword"), "user@example.com", Set.of(userRole));
        User admin = new User("AdminName", "AdminSurname", 30, "admin", passwordEncoder.encode("adminpassword"), "admin@example.com", Set.of(adminRole));

        userRepository.save(user);
        userRepository.save(admin);
    }
}