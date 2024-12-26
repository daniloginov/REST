package com.example.bs.utils;

import com.example.bs.models.Role;

import java.util.Collection;
import java.util.stream.Collectors;

public final class UserUtil {
    public static String getStringRoles(Collection<Role> roles) {
        return roles.stream()
                .map(role -> role.getAuthority().replaceAll("ROLE_", ""))
                .collect(Collectors.joining(", "));
    }
}