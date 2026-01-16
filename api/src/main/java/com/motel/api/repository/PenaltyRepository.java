package com.motel.api.repository;

import com.motel.api.model.Penalty;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface PenaltyRepository extends JpaRepository<Penalty, Long> {
    // Busca todas as penalidades de um usuário específico
    Optional<Penalty> findByUserId(Long userId);

    // NOVO: Verifica se existe ALGUMA multa para este usuário (retorna true/false)
    boolean existsByUserId(Long userId);

    Optional<Penalty> findByPublicId(UUID publicId);

}