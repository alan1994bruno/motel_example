package com.motel.api.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record ReservationDTO(
        UUID roomPublicId, // O ID público do quarto
        LocalDateTime checkinTime,
        LocalDateTime checkoutTime
) {}
