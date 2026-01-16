package com.motel.api.dto;

public record UserUpdateDTO(
        String email,
        String phone,
        String cpf,
        String cep,
        String password // <--- (Opcional)
) {}