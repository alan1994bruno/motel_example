package com.example.motel.ui

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bed
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.ExitToApp
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.motel.viewmodel.HomeViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainTabScreen(
    onLogout: () -> Unit,
    onSuiteClick: (String) -> Unit
) {
    // Estado para saber qual aba está selecionada (0=Suites, 1=Reservas, 2=Pendencias)
    var selectedTab by remember { mutableStateOf(0) }

    // ViewModel da Home (para lista de suites)
    val homeViewModel: HomeViewModel = viewModel()

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    // Título muda conforme a aba
                    val titulo = when(selectedTab) {
                        0 -> "MOTEL"
                        1 -> "MINHAS RESERVAS"
                        else -> "PENDÊNCIAS"
                    }
                    Text(titulo, fontWeight = FontWeight.Bold, color = Color.White)
                },
                actions = {
                    IconButton(onClick = onLogout) {
                        Icon(Icons.Default.ExitToApp, "Sair", tint = Color.White)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = BrandPurple)
            )
        },
        bottomBar = {
            NavigationBar(containerColor = Color.White) {
                // Aba 1: Suítes
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Bed, contentDescription = null) },
                    label = { Text("Suítes") },
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    colors = NavigationBarItemDefaults.colors(selectedIconColor = BrandPurple, indicatorColor = Color(0xFFEDE7F6))
                )

                // Aba 2: Reservas
                NavigationBarItem(
                    icon = { Icon(Icons.Default.CalendarMonth, contentDescription = null) },
                    label = { Text("Reservas") },
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    colors = NavigationBarItemDefaults.colors(selectedIconColor = BrandPurple, indicatorColor = Color(0xFFEDE7F6))
                )

                // Aba 3: Pendências
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Warning, contentDescription = null) },
                    label = { Text("Pendências") },
                    selected = selectedTab == 2,
                    onClick = { selectedTab = 2 },
                    colors = NavigationBarItemDefaults.colors(selectedIconColor = BrandRed, indicatorColor = Color(0xFFFFEBEE))
                )
            }
        }
    ) { innerPadding ->
        // TROCA DE TELAS
        Surface(modifier = Modifier.padding(innerPadding)) {
            when (selectedTab) {
                0 -> {
                    // Aqui chamamos o conteúdo da HomeScreen antiga.
                    // Para facilitar, vou "extrair" o conteúdo da sua HomeScreen aqui.
                    // Se você já tem o HomeScreen pronto, você pode só chamá-lo aqui
                    // MAS precisaria remover o Scaffold de dentro dele para não duplicar barras.

                    // RECOMENDAÇÃO: Use o conteúdo da lista de quartos aqui:
                    HomeScreenContentOnly(viewModel = homeViewModel, onSuiteClick = onSuiteClick)
                }
                1 -> MyReservationsScreen()
                2 -> MyPenaltiesScreen()
            }
        }
    }
}