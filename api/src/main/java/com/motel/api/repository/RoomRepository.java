package com.motel.api.repository;

import com.motel.api.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {
    // O Spring cria o SQL automaticamente baseado no nome do método
    boolean existsByName(String name);

    // Busca exata e retorna um único item (Optional)
    Optional<Room> findByNameIgnoreCase(String name);
}