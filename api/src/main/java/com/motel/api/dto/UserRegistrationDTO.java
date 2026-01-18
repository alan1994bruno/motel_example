package com.motel.api.dto;

import jakarta.validation.constraints.*;

public record UserRegistrationDTO(
        @NotBlank(message = "O email é obrigatório")
        @Email(message = "O formato do email é inválido")
        String email,

        @NotBlank(message = "A senha é obrigatória")
        @Size(min = 8, message = "A senha deve ter no mínimo 8 caracteres")
        @Pattern(
                regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$",
                message = "A senha deve conter pelo menos um número, uma letra maiúscula, uma minúscula e um caractere especial"
        )
        String password,

        @NotBlank(message = "O CPF é obrigatório")
        @Pattern(
                regexp = "\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}",
                message = "O CPF deve seguir o formato 000.000.000-00"
        )
        String cpf,

        @NotBlank(message = "O CEP é obrigatório")
        @Pattern(regexp = "\\d{5}-\\d{3}", message = "O CEP deve seguir o formato 00000-000")
        String cep,

        @NotBlank(message = "O telefone é obrigatório")
        @Pattern(
                regexp = "^\\(\\d{2}\\) \\d{5}-\\d{4}$",
                message = "O telefone deve seguir o formato (XX) XXXXX-XXXX apenas com números"
        )
        String phone
) {}