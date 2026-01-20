package com.motel.api.controller;

import com.motel.api.dto.*;
import com.motel.api.model.User;
import com.motel.api.service.PasswordService;
import com.motel.api.service.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    @Autowired
    private PasswordService passwordService;

    public AuthController(AuthenticationManager authenticationManager, TokenService tokenService) {
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO data) {
        System.out.println("Bateu "+data.email()+"  "+data.password());
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.password());
        var auth = this.authenticationManager.authenticate(usernamePassword);
        System.out.println(auth.toString());
        var token = tokenService.generateToken((User) auth.getPrincipal());

        return ResponseEntity.ok(Map.of("token", token,"email",data.email()));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody @Valid PasswordRecoveryDTO body) {
        try {
            passwordService.requestPasswordRecovery(body);
            return ResponseEntity.ok("Código de recuperação enviado para o email.");
        } catch (RuntimeException e) {
            // Por segurança, às vezes é bom retornar OK mesmo se o email não existir
            // Mas para dev/MVP, retornar o erro ajuda:
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Rota 2: Troca a senha
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody @Valid PasswordResetDTO body) {
        System.out.println("Bateu "+body.code()+" "+"senha "+body.newPassword());
        try {
            passwordService.resetPassword(body);
            return ResponseEntity.ok("Senha alterada com sucesso! Faça login novamente.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}