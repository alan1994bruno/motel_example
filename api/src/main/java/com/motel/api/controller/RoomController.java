package com.motel.api.controller;
import com.motel.api.dto.RoomDTO;
import com.motel.api.model.Room;
import com.motel.api.service.RoomService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/rooms")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody RoomDTO body) {
        try {
            Room room = roomService.createRoom(body);
            return ResponseEntity.ok(room);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Room>> listAll() {
        return ResponseEntity.ok(roomService.listAll());
    }

    @GetMapping("page")
    public ResponseEntity<Page<Room>> listAllPage(@RequestParam(defaultValue = "1") int page) {
        return ResponseEntity.ok(roomService.listAll(page));
    }

    // 2. Rota de Busca Específica por UUID (Devolve Objeto Único)
    @GetMapping("/{uuid}")
    public ResponseEntity<Room> findByName(@PathVariable UUID uuid) {
        return ResponseEntity.ok(roomService.findByUUID(uuid));
    }
}