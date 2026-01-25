package com.example.motel.viewmodel

import android.app.Application
import android.widget.Toast
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.motel.network.RetrofitClient
import com.example.motel.network.dto.ReservationDto
import kotlinx.coroutines.launch
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit

class MyReservationsViewModel(application: Application) : AndroidViewModel(application) {

    var reservation by mutableStateOf<ReservationDto?>(null)
    var isLoading by mutableStateOf(true)

    init {
        fetchReservation()
    }

    fun fetchReservation() {
        viewModelScope.launch {
            isLoading = true
            try {
                // Busca a reserva ativa
                reservation = RetrofitClient.api.getMyReservation()
            } catch (e: Exception) {
                // Se der 404 ou erro, assume que não tem reserva
                reservation = null
                e.printStackTrace()
            } finally {
                isLoading = false
            }
        }
    }

    // Formata a data de entrada (ex: "28/01/2026 às 14:00")
    fun getFormattedCheckin(): String {
        return formatDate(reservation?.checkinTime)
    }

    // Formata a data de saída
    fun getFormattedCheckout(): String {
        return formatDate(reservation?.checkoutTime)
    }

    // Define o status para mostrar no Badge
    fun getStatusLabel(): String {
        val r = reservation ?: return ""
        return if (r.occupied) "EM USO" else "AGENDADA"
    }

    private fun formatDate(dateStr: String?): String {
        if (dateStr == null) return "--/--"
        return try {
            val cleanDate = dateStr.replace(" ", "T") // Garante compatibilidade ISO
            val date = LocalDateTime.parse(cleanDate)
            date.format(DateTimeFormatter.ofPattern("dd/MM 'às' HH:mm"))
        } catch (e: Exception) {
            "Data inválida"
        }
    }

    fun cancelReservation() {
        val res = reservation ?: return // Segurança

        viewModelScope.launch {
            isLoading = true
            try {
                // Chama a API
                RetrofitClient.api.cancelReservation(res.publicId)

                // Sucesso: Limpa a reserva da tela e avisa
                reservation = null
                Toast.makeText(getApplication(), "Reserva cancelada com sucesso.", Toast.LENGTH_SHORT).show()

            } catch (e: Exception) {
                e.printStackTrace()
                Toast.makeText(getApplication(), "Erro ao cancelar: ${e.message}", Toast.LENGTH_LONG).show()
            } finally {
                isLoading = false
            }
        }
    }

    // Verifica se o cancelamento é "Tardio" (Menos de 48h para o check-in)
    fun isLateCancellation(): Boolean {
        val res = reservation ?: return false

        return try {
            // Limpa a string da data para garantir formato ISO
            val cleanDate = res.checkinTime.replace(" ", "T")
            val checkinDate = LocalDateTime.parse(cleanDate)
            val now = LocalDateTime.now()

            // Calcula horas de diferença
            val hoursUntilCheckin = ChronoUnit.HOURS.between(now, checkinDate)

            // Retorna TRUE se faltar menos de 48 horas
            hoursUntilCheckin < 48
        } catch (e: Exception) {
            false // Se der erro na data, assume que não tem multa (segurança)
        }
    }

    // Calcula o valor da multa (50%)
    fun getPenaltyValue(): Double {
        return (reservation?.price ?: 0.0) * 0.5
    }

    // Calcula o total com multa
    fun getTotalWithPenalty(): Double {
        val price = reservation?.price ?: 0.0
        return price + (price * 0.5)
    }
}