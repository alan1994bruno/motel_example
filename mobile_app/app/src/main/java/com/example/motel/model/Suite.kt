package com.example.motel.model

data class Suite(
    val id: Int,
    val name: String,
    val price: Double,
    val description: String = "Ar-condicionado, ducha, frigobar e garagem privativa"
)

val mockSuites = listOf(
    Suite(1, "Self", 20.00),
    Suite(2, "Self Plus", 30.00),
    Suite(3, "Erótica", 40.00),
    Suite(4, "Erótica Hidro", 60.00),
    Suite(5, "Nudes Hidro", 80.00),
    Suite(6, "Duplex Hidro", 120.00),
    Suite(7, "Teste", 2.00),
    Suite(8, "Teste 2", 50.00)
)