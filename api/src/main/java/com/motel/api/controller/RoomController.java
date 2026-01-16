package com.motel.api.controller;
import com.motel.api.dto.RoomDTO;
import com.motel.api.model.Room;
import com.motel.api.service.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    // 2. Rota de Busca Específica por Nome (Devolve Objeto Único)
    @GetMapping("/name/{name}")
    public ResponseEntity<Room> findByName(@PathVariable String name) {
        return ResponseEntity.ok(roomService.findByName(name));
    }
}