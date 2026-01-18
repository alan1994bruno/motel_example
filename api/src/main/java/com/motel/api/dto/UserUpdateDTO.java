package com.motel.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserUpdateDTO(

        @Email(message = "O formato do email é inválido")
        String email,

        // Aceita NULL (não atualiza). Se vier texto, TEM que bater com o Regex.
        @Pattern(
                regexp = "^\\(\\d{2}\\) \\d{5}-\\d{4}$",
                message = "O telefone deve seguir o formato (XX) XXXXX-XXXX apenas com números"
        )
        String phone,

        @Pattern(
                regexp = "\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}",
                message = "O CPF deve seguir o formato 000.000.000-00"
        )
        String cpf,

        @Pattern(
                regexp = "\\d{5}-\\d{3}",
                message = "O CEP deve seguir o formato 00000-000"
        )
        String cep,

        // Senha opcional, mas se mandar, tem que ser forte
        @Size(min = 8, message = "A senha deve ter no mínimo 8 caracteres")
        @Pattern(
                regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$",
                message = "A senha deve conter pelo menos um número, uma letra maiúscula, minúscula e especial"
        )
        String password
) {}