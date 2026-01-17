package com.example.motel.model

data class Suite(
    val id: String, // Mudamos de Int para String (publicId)
    val name: String,
    val price: Double,
    val imageUrl: String?, // Nova propriedade para a foto
    val description: String = "Ar-condicionado, ducha, frigobar e garagem privativa"
)

