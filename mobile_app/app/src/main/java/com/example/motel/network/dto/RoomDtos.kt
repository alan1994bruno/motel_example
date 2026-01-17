package com.example.motel.network.dto

import com.google.gson.annotations.SerializedName

// Representa o objeto principal da lista
data class RoomDto(
    val publicId: String,
    val name: String,
    val hourlyRate: Double,
    val units: Int,
    val images: List<RoomImageDto>? // Pode vir nulo ou vazio
)

// Representa a imagem dentro da lista "images"
data class RoomImageDto(
    val publicId: String,
    val url: String
)