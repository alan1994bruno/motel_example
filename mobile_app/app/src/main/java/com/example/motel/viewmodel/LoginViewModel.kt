package com.example.motel.viewmodel

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.motel.network.RetrofitClient
import com.example.motel.network.dto.*
import kotlinx.coroutines.launch

class LoginViewModel : ViewModel() {
    var isLoading by mutableStateOf(false)
    var errorMessage by mutableStateOf<String?>(null)

    fun login(email: String, pass: String, onSuccess: () -> Unit) {
        viewModelScope.launch {
            isLoading = true
            errorMessage = null
            try {
                // Chama o Spring Boot
                val response = RetrofitClient.api.login(LoginRequest(email, pass))
                println("Sucesso! Token: ${response.token}")

                isLoading = false
                onSuccess()
            } catch (e: Exception) {
                isLoading = false
                errorMessage = "Falha: ${e.message}"
                e.printStackTrace()
            }
        }
    }

    fun register(name: String, email: String, pass: String, cpf: String, phone: String, onSuccess: () -> Unit) {
        viewModelScope.launch {
            isLoading = true
            errorMessage = null
            try {
                val request = RegisterRequest(name, email, pass, cpf, phone)
                RetrofitClient.api.register(request)
                isLoading = false
                onSuccess()
            } catch (e: Exception) {
                isLoading = false
                errorMessage = "Erro no cadastro: ${e.message}"
            }
        }
    }
}