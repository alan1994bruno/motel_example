package com.example.motel.network.dto

// O que o seu @PostMapping("/login") espera
data class LoginRequest(
    val email: String,
    val password: String
)

// O que o seu @PostMapping("/register") espera
data class RegisterRequest(
    val name: String,
    val email: String,
    val password: String,
    val cpf: String,
    val phone: String
)

// O que o Spring devolve (Geralmente um JWT e dados do user)
// Ajuste os nomes dos campos conforme a sua classe "LoginResponseDTO" no Java
data class AuthResponse(
    val token: String, // ou "accessToken"
    val name: String,
    val email: String
)