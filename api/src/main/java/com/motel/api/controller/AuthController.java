package com.motel.api.controller;

import com.motel.api.dto.LoginDTO;
import com.motel.api.model.User;
import com.motel.api.service.TokenService;
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
}