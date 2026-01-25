package com.example.motel.viewmodel

import android.app.Application
import android.util.Log
import android.widget.Toast
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.motel.model.Suite
import com.example.motel.network.RetrofitClient
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.time.LocalTime
import java.time.temporal.ChronoUnit
import com.example.motel.network.dto.CreateReservationRequest
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

class SuiteDetailViewModel(application: Application) : AndroidViewModel(application) {

    var suite by mutableStateOf<Suite?>(null)
    var isLoading by mutableStateOf(true)

    // MUDANÇA 1: Agora começam como NULL (vazios)
    var selectedDate by mutableStateOf<LocalDate?>(null)
    var startTime by mutableStateOf<LocalTime?>(null)
    var endTime by mutableStateOf<LocalTime?>(null)

    var totalPrice by mutableStateOf(0.0)

    var reservationState by mutableStateOf<Result<Boolean>?>(null)


    fun createReservation() {
        // 1. Validação de Segurança (Só pra garantir)
        if (suite == null || selectedDate == null || startTime == null || endTime == null) return

        if (suite == null || selectedDate == null || startTime == null || endTime == null) return

        viewModelScope.launch {
            isLoading = true
            try {
                // 2. Montagem das Datas (ISO 8601)

                val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss")


                // Check-in: Data Selecionada + Hora de Entrada
                val checkinDateTime = LocalDateTime.of(selectedDate, startTime)

                // Check-out: Precisamos saber se virou o dia
                val checkoutDate = if (endTime!!.isBefore(startTime)) {
                    // Se hora de saída é ANTES da entrada (ex: 14h entrada, 02h saída), é dia seguinte
                    selectedDate!!.plusDays(1)
                } else {
                    // Mesmo dia
                    selectedDate!!
                }
                val checkoutDateTime = LocalDateTime.of(checkoutDate, endTime)
                val checkinString = checkinDateTime.format(formatter)   // Vai gerar "2026-01-31T11:00:00"
                val checkoutString = checkoutDateTime.format(formatter) // Vai gerar "2026-01-31T14:00:00"
                // 3. Criação do Request
                val request = CreateReservationRequest(
                    roomPublicId = suite!!.id, // Lembre que mapeamos publicId -> id no Model
                    checkinTime = checkinString, // Formata automático para ISO: "2026-01-28T14:00"
                    checkoutTime = checkoutString
                )

                Log.w("erro","${request}")

                // 4. Envio para API
                RetrofitClient.api.createReservation(request)

                // Sucesso!
                reservationState = Result.success(true)
                Toast.makeText(
                    getApplication(),
                    "Reserva realizada com sucesso!",
                    Toast.LENGTH_LONG
                ).show()

            } catch (e: Exception) {
                e.printStackTrace()
                reservationState = Result.failure(e)
                Toast.makeText(
                    getApplication(),
                    "Erro ao reservar: ${e.message} ${e}",
                    Toast.LENGTH_LONG
                ).show()
                Log.w("erro",e);
            } finally {
                isLoading = false
            }
        }
    }

    fun loadSuite(suiteId: String) {
        // ... (Mantenha o código de loadSuite igual estava)
        viewModelScope.launch {
            isLoading = true
            try {
                val allRooms = RetrofitClient.api.getRooms()
                val foundSuite = allRooms.find { it.publicId == suiteId }
                if (foundSuite != null) {
                    suite = Suite(
                        id = foundSuite.publicId,
                        name = foundSuite.name,
                        price = foundSuite.hourlyRate,
                        imageUrl = foundSuite.images?.firstOrNull()?.url,
                        description = foundSuite.images?.map { it.url }?.joinToString(",") ?: ""
                    )
                    // Não calcula total ao abrir, pois não tem hora selecionada
                }
            } catch (e: Exception) {
                e.printStackTrace()
            } finally {
                isLoading = false
            }
        }
    }

    fun validateAndSetDate(date: LocalDate) {
        val minDate = LocalDate.now().plusDays(3)
        if (date.isBefore(minDate)) {
            Toast.makeText(getApplication(), "Reservas apenas com 3 dias de antecedência.", Toast.LENGTH_SHORT).show()
        } else {
            selectedDate = date
        }
    }

    // MUDANÇA 2: Validação agora recebe Nullable mas só processa se tiver valor
    fun validateAndSetTime(start: LocalTime?, end: LocalTime?) {
        // Se um dos dois ainda não foi escolhido, apenas atualiza o estado sem validar 6h
        if (start == null || end == null) {
            startTime = start
            endTime = end
            return
        }

        // Se ambos foram escolhidos, valida a regra das 6 horas
        var minutesDiff = ChronoUnit.MINUTES.between(start, end)
        if (minutesDiff < 0) minutesDiff += 24 * 60

        if (minutesDiff > 6 * 60) {
            Toast.makeText(getApplication(), "Período máximo de 6 horas.", Toast.LENGTH_SHORT).show()
            // Reseta para forçar escolha válida ou mantém o anterior?
            // Vamos manter o novo valor mas avisar, ou você pode impedir a mudança.
            // Aqui vou impedir a mudança do END se estourar:
            // (Lógica simplificada: aceita mas avisa, o botão confirmar que vai travar se quiser)
        }

        // Atualiza e calcula
        startTime = start
        endTime = end
        calculateTotal()
    }

    private fun calculateTotal() {
        // MUDANÇA 3: Só calcula se tiver tudo preenchido
        val s = startTime
        val e = endTime
        val p = suite?.price

        if (s != null && e != null && p != null) {
            var hours = ChronoUnit.HOURS.between(s, e).toDouble()
            if (hours < 0) hours += 24
            if (hours == 0.0) hours = 1.0
            totalPrice = hours * p
        } else {
            totalPrice = 0.0
        }
    }

    fun getImageList(): List<String> {
        return suite?.description?.split(",")?.filter { it.isNotEmpty() } ?: emptyList()
    }

    // Helper para saber se pode confirmar
    fun isValid(): Boolean {
        return selectedDate != null && startTime != null && endTime != null && totalPrice > 0
    }


}