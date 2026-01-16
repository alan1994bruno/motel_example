package com.motel.api.repository;

import com.motel.api.model.User;
import com.motel.api.model.Role;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page; // Importante
import org.springframework.data.domain.Pageable; // Importante
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);


    // --- NOVO MÉTODO PAGINADO ---
    // Busca usuários onde a Role tenha o nível específico, paginando o resultado
    @EntityGraph(attributePaths = {"profile", "role", "penalty"})
    Page<User> findByRoleLevel(Role.Level level, Pageable pageable);


    @Query("SELECT u FROM User u JOIN Penalty p ON p.user.id = u.id")
    Page<User> findUsersWithPenalties(Pageable pageable);


    @EntityGraph(attributePaths = {"profile", "role", "penalty"})
    Optional<User> findByPublicId(UUID publicId);


}