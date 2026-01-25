package com.example.motel

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.platform.LocalContext
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.motel.local.TokenManager
import com.example.motel.ui.LoginScreen
import com.example.motel.ui.MainTabScreen
import com.example.motel.ui.SuiteDetailScreen


class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val tokenManager = TokenManager(this)
        val savedToken = tokenManager.getToken()
        // Se tiver token, inicia na home, senão login
        val startDestination = if (tokenManager.getToken() != null) "home" else "login"

        if (savedToken != null) {
            com.example.motel.network.RetrofitClient.authToken = savedToken
        }
        setContent {
            val navController = rememberNavController()

            NavHost(navController = navController, startDestination = startDestination) {

                // Rota de Login
                composable("login") {
                    LoginScreen(onLoginSuccess = {
                        navController.navigate("home") {
                            popUpTo("login") { inclusive = true } // Remove login da pilha
                        }
                    })
                }

                // Rota Home
                composable("home") {
                    MainTabScreen( // <--- Mudou aqui
                        onLogout = {
                            tokenManager.clearToken()
                            navController.navigate("login") {
                                popUpTo("home") { inclusive = true }
                            }
                        },
                        onSuiteClick = { suiteId ->
                            navController.navigate("details/$suiteId")
                        }
                    )
                }

                // Rota Detalhes (Recebe o ID)
                composable(
                    route = "details/{suiteId}",
                    arguments = listOf(navArgument("suiteId") { type = NavType.StringType })
                ) { backStackEntry ->
                    val suiteId = backStackEntry.arguments?.getString("suiteId") ?: ""
                    SuiteDetailScreen(
                        suiteId = suiteId,
                        onBack = { navController.popBackStack() }
                    )
                }
            }
        }
    }
}

