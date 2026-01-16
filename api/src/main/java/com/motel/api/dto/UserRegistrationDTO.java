package com.motel.api.dto;

public record UserRegistrationDTO(
        String email,
        String password,
        // Dados opcionais (só obrigatórios se for CLIENT)
        String cpf,
        String cep,
        String phone
) {}