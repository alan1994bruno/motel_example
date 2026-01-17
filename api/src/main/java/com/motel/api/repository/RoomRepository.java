package com.motel.api.repository;

import com.motel.api.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RoomRepository extends JpaRepository<Room, Long> {
    // O Spring cria o SQL automaticamente baseado no nome do método
    boolean existsByName(String name);

    // O CORRETO: Busca pelo UUID público
    Optional<Room> findByPublicId(UUID publicId);
}