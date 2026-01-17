package com.example.motel.viewmodel

import android.util.Log
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.motel.model.Suite
import com.example.motel.network.RetrofitClient
import kotlinx.coroutines.launch

class HomeViewModel : ViewModel() {

    // Lista de suítes que a tela vai observar
    var suites by mutableStateOf<List<Suite>>(emptyList())
    var isLoading by mutableStateOf(false)
    var errorMessage by mutableStateOf<String?>(null)

    init {
        // Busca os quartos assim que o ViewModel nasce
        fetchRooms()
    }

    fun fetchRooms() {
        viewModelScope.launch {
            isLoading = true
            errorMessage = null
            try {
                // 1. Chama a API
                val roomsDto = RetrofitClient.api.getRooms()

                // 2. Converte DTO (JSON) para Model (Tela)
                suites = roomsDto.map { dto ->
                    Suite(
                        id = dto.publicId,
                        name = dto.name,
                        price = dto.hourlyRate,
                        // Pega a primeira imagem da lista, ou null se não tiver
                        imageUrl = dto.images?.firstOrNull()?.url
                    )
                }
            } catch (e: Exception) {
                errorMessage = "Erro ao carregar quartos: ${e.message}"
                Log.e("HomeViewModel", "Erro", e)
            } finally {
                isLoading = false
            }
        }
    }
}