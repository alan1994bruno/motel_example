package com.example.motel

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.*
import com.example.motel.local.TokenManager
import com.example.motel.ui.*



class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val tokenManager = TokenManager(this)
        val savedToken = tokenManager.getToken()
        setContent {
            MaterialTheme {
                var isLoggedIn by remember { mutableStateOf(savedToken != null) }

                if (isLoggedIn) {
                    HomeScreen(onLogout = {
                        // Ao sair, apaga do disco e volta pro login
                        tokenManager.clearToken()
                        isLoggedIn = false
                    })
                } else {
                    LoginScreen(onLoginSuccess = { isLoggedIn = true })
                }
            }
        }
    }
}

