package com.example.motel.viewmodel

import android.app.Application
import android.util.Log
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.motel.network.RetrofitClient
import com.example.motel.network.dto.PenaltyDto
import kotlinx.coroutines.launch
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

class PenaltiesViewModel(application: Application) : AndroidViewModel(application) {

    // O estado da penalidade (pode ser nulo)
    var penalty by mutableStateOf<PenaltyDto?>(null)
    var isLoading by mutableStateOf(true)

    init {
        fetchPenalty()
    }

    fun fetchPenalty() {
        viewModelScope.launch {
            isLoading = true
            try {
                // Tenta buscar na API
                penalty = RetrofitClient.api.getMyPenalty()
            } catch (e: Exception) {
                Log.e("erro",e.toString());
                // Se der erro (ex: 404 Not Found), assumimos que não tem penalidade
                penalty = null
                e.printStackTrace()
            } finally {
                isLoading = false
            }
        }
    }

    // Helper para formatar a data que vem da API ("2026-01-30T...") para ("30/01/2026")
    fun getFormattedDate(): String {
        return try {
            val dateStr = penalty?.checkinTime ?: return ""
            // O backend manda ISO (com T) ou SQL (com espaço). O 'replace' garante que o parse funcione.
            val cleanDate = dateStr.replace(" ", "T")
            val date = LocalDateTime.parse(cleanDate)
            date.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
        } catch (e: Exception) {
            "Data desconhecida"
        }
    }
}