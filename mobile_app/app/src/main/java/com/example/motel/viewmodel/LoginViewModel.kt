package com.example.motel.viewmodel

import android.util.Log
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.motel.local.TokenManager
import com.example.motel.network.RetrofitClient
import com.example.motel.network.dto.*
import kotlinx.coroutines.launch
import android.app.Application
import androidx.lifecycle.AndroidViewModel

class LoginViewModel (application: Application) : AndroidViewModel(application) {
    var isLoading by mutableStateOf(false)
    var errorMessage by mutableStateOf<String?>(null)

    private val tokenManager = TokenManager(application.applicationContext)

    fun login(email: String, pass: String, onSuccess: () -> Unit) {
        viewModelScope.launch {
            isLoading = true
            errorMessage = null
            try {
                // Chama o Spring Boot
                val response = RetrofitClient.api.login(LoginRequest(email, pass))
                println("Sucesso! Token: ${response.token}")
                Log.e("token",response.token)
                tokenManager.saveToken(response.token)
                RetrofitClient.authToken = response.token
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