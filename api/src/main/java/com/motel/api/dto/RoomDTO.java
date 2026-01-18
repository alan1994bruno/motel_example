package com.motel.api.dto;

import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.URL; // Importante para validar o link
import java.math.BigDecimal;
import java.util.List;

public record RoomDTO(

        @NotBlank(message = "O nome do quarto é obrigatório")
        String name,

        @NotNull(message = "O valor da hora é obrigatório")
        @Positive(message = "O valor deve ser maior que zero")
        BigDecimal hourlyRate,

        @NotNull(message = "A quantidade de unidades é obrigatória")
        @Min(value = 1, message = "Deve haver pelo menos 1 unidade disponível")
        Integer units,

        @NotNull(message = "A lista de imagens não pode ser nula")
        @Size(min = 3, message = "É obrigatório enviar no mínimo 3 imagens do quarto")
        // Valida cada item dentro da lista individualmente:
        List<@NotBlank(message="A URL não pode estar em branco") @URL(message = "Formato de URL inválido") String> images
) {}