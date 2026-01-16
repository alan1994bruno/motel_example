package com.motel.api.repository;

import com.motel.api.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    // Busca a role pelo Enum (ADMIN ou CLIENT)
    Optional<Role> findByLevel(Role.Level level);
}