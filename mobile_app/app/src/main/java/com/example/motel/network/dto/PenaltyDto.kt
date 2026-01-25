package com.example.motel.network.dto

data class PenaltyDto(
    val publicId: String,
    val checkinTime: String,
    val checkoutTime: String,
    val occupied: Boolean,
    val penaltyApplied: Boolean,
    val price: Double,
    val room: RoomSummaryDto? // O objeto Room dentro do resumo
)

// Uma versão simplificada do quarto que vem dentro da penalidade
data class RoomSummaryDto(
    val name: String
)