package com.motel.api.controller;

import com.motel.api.dto.UserRegistrationDTO;
import com.motel.api.model.User;
import com.motel.api.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import com.motel.api.dto.UserUpdateDTO;
import java.util.UUID;
import java.util.Iterator;

@RestController
@RequestMapping("/users")
public class UserController  {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody UserRegistrationDTO body) {
        try {
            User createdUser = userService.registerUser(body);
            return ResponseEntity.ok("Usuário criado com ID: " + createdUser.getPublicId());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro: " + e.getMessage());
        }
    }

    @GetMapping("/clients")
    public ResponseEntity<Page<User>> listClients(@RequestParam(defaultValue = "1") int page) {
        System.out.printf("Page %d \n",page);
        var x=  userService.findAllClients(page);
        Iterator<User> it = x.iterator();
        while (it.hasNext()){
            System.out.println(it.next().getEmail());
        }
        return ResponseEntity.ok(x);
    }

    @GetMapping("/penalized")
    public ResponseEntity<Page<User>> listPenalizedUsers(@RequestParam(defaultValue = "1") int page) {
        return ResponseEntity.ok(userService.findPenalizedUsers(page));
    }

    // GET /users/{publicId} - Busca detalhes de um usuário específico
    @GetMapping("/{publicId}")
    public ResponseEntity<User> getByPublicId(@PathVariable UUID publicId) {
        return ResponseEntity.ok(userService.findByPublicId(publicId));
    }

    // PUT /users/{publicId} - Atualiza dados do usuário
    @PutMapping("/{publicId}")
    public ResponseEntity<User> updateUser(
            @PathVariable UUID publicId,
            @RequestBody UserUpdateDTO data) {
        return ResponseEntity.ok(userService.updateUser(publicId, data));
    }
}