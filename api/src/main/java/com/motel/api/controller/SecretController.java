package com.motel.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/secret")
public class SecretController {

    @GetMapping
    public ResponseEntity<String> getSecretMessage(@AuthenticationPrincipal UserDetails user) {
        // @AuthenticationPrincipal injeta o usuário que foi extraído do Token automaticamente!

        return ResponseEntity.ok("Olá, " + user.getUsername() + "! Se você está lendo isso, seu Token é válido.");
    }
}