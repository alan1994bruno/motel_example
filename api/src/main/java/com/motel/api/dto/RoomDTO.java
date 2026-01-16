package com.motel.api.dto;

import java.math.BigDecimal;
import java.util.List;

public record RoomDTO(
        String name,
        BigDecimal hourlyRate,
        Integer units,
        List<String> images // Lista de URLs (Obrigatório enviar 3)
) {}