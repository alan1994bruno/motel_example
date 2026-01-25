package com.example.motel.network.dto

import com.google.gson.annotations.SerializedName

data class CreateReservationRequest(
    val roomPublicId: String,
    val checkinTime: String, // String ISO 8601
    val checkoutTime: String
)

data class ReservationDto(
    val publicId: String,
    val checkinTime: String,
    val checkoutTime: String,
    val occupied: Boolean, // Indica se o cliente já está dentro do quarto
    val penaltyApplied: Boolean,
    val price: Double,
    val room: RoomSummaryDto? // Reutilizando o DTO de quarto que criamos no passo anterior
)