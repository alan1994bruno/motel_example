package com.motel.api.service;

import com.motel.api.dto.RoomDTO;
import com.motel.api.model.File;
import com.motel.api.model.Room;
import com.motel.api.repository.RoomRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public Room createRoom(RoomDTO data) {
        // 1. Regra: Nome Único
        if (roomRepository.existsByName(data.name())) {
            throw new IllegalArgumentException("Já existe um quarto com este nome.");
        }

        // --- NOVA REGRA: 3 IMAGENS OBRIGATÓRIAS ---
        if (data.images() == null || data.images().size() != 3) {
            throw new IllegalArgumentException("É obrigatório fornecer exatamente 3 URLs de imagens para o quarto.");
        }
        // ------------------------------------------

        Room room = new Room();
        room.setName(data.name());
        room.setHourlyRate(data.hourlyRate());
        room.setUnits(data.units());

        // 2. Converter as Strings (URLs) em Entidades (File)
        List<File> fileEntities = data.images().stream()
                .map(url -> new File(url)) // Cria o objeto File
                .collect(Collectors.toList());

        // 3. Associar ao quarto
        room.setImages(fileEntities);

        // 4. Salva tudo (Quarto + Imagens + Relacionamento na room_files)
        return roomRepository.save(room);
    }

    public List<Room> listAll() {
        return roomRepository.findAll();
    }

    public Room findByUUID(UUID uuid) {
        return roomRepository.findByPublicId(uuid)
                .orElseThrow(() -> new RuntimeException("Quarto não encontrado com o uuid: " + uuid));
    }



}