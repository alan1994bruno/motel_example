package com.motel.api.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.UUID;

public record ReservationDTO(
        @NotNull(message = "O ID do quarto é obrigatório")
        UUID roomPublicId,

        @NotNull(message = "A data de check-in é obrigatória")
        @Future(message = "A data de check-in deve ser no futuro") // Garante que não é data passada
        LocalDateTime checkinTime,

        @NotNull(message = "A data de check-out é obrigatória")
        @Future(message = "A data de check-out deve ser no futuro")
        LocalDateTime checkoutTime
) {}