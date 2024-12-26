package com.example.bs.service;

import com.example.bs.models.Role;
import java.util.Collection;
import java.util.List;

public interface RoleService {

    void addRole(Role role);

    List<Role> findAll();

    Collection<Role> findByName(String name);
}