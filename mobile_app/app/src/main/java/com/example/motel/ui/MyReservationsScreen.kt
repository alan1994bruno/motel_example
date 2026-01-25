package com.example.motel.ui

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.motel.viewmodel.MyReservationsViewModel

@Composable
fun MyReservationsScreen(
    viewModel: MyReservationsViewModel = viewModel()
) {
    // Controla qual dialog mostrar
    var showStandardDialog by remember { mutableStateOf(false) }
    var showPenaltyDialog by remember { mutableStateOf(false) }

    // --- 1. DIALOG PADRÃO (Sem multa) ---
    if (showStandardDialog) {
        AlertDialog(
            onDismissRequest = { showStandardDialog = false },
            title = { Text("Cancelar Reserva?", fontWeight = FontWeight.Bold, color = BrandPurple) },
            text = { Text("Faltam mais de 48h para seu check-in. O cancelamento é gratuito.") },
            confirmButton = {
                Button(
                    onClick = {
                        showStandardDialog = false
                        viewModel.cancelReservation()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = BrandRed)
                ) { Text("Sim, Cancelar") }
            },
            dismissButton = {
                TextButton(onClick = { showStandardDialog = false }) { Text("Voltar", color = Color.Gray) }
            },
            containerColor = Color.White
        )
    }

    // --- 2. DIALOG DE PENALIDADE (Com multa - Igual ao seu print) ---
    if (showPenaltyDialog) {
        AlertDialog(
            onDismissRequest = { showPenaltyDialog = false },
            containerColor = Color.White,
            title = {
                Text("Atenção: Penalidade Aplicável", color = BrandRed, fontWeight = FontWeight.Bold, fontSize = 18.sp)
            },
            text = {
                Column {
                    Text(
                        "Você está tentando cancelar com menos de 48 horas de antecedência. Conforme nossa política, será cobrada uma multa.",
                        fontSize = 13.sp, color = Color.Gray
                    )
                    Spacer(modifier = Modifier.height(16.dp))

                    // CARD DE CÁLCULO (Fundo Rosa)
                    Card(
                        colors = CardDefaults.cardColors(containerColor = Color(0xFFFFEBEE)), // Fundo rosinha claro
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            // Linha Valor Original
                            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                Text("Valor Reserva:", color = Color.Gray, fontSize = 14.sp)
                                Text("R$ ${String.format("%.2f", viewModel.reservation?.price)}", color = Color.Gray, fontSize = 14.sp)
                            }

                            // Linha Multa
                            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                Text("+ Multa (50%):", color = BrandRed, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                Text("R$ ${String.format("%.2f", viewModel.getPenaltyValue())}", color = BrandRed, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            }

                            Spacer(modifier = Modifier.height(8.dp))
                            Divider(color = Color(0xFFFFCDD2))
                            Spacer(modifier = Modifier.height(8.dp))

                            // Linha Total
                            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                Text("Total a Pagar:", color = BrandRed, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                                Text("R$ ${String.format("%.2f", viewModel.getTotalWithPenalty())}", color = BrandRed, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))
                    Text("Ao confirmar, você concorda com a cobrança imediata deste valor.", fontSize = 10.sp, color = Color.Gray)
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        showPenaltyDialog = false
                        viewModel.cancelReservation() // Executa o cancelamento (Backend deve aplicar a multa)
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = BrandRed),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text("Aceitar Multa e Cancelar", fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                OutlinedButton(
                    onClick = { showPenaltyDialog = false },
                    border = BorderStroke(1.dp, Color.LightGray),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text("Voltar", color = Color.Black)
                }
            }
        )
    }

    // --- CONTEÚDO DA TELA ---
    if (viewModel.isLoading) {
        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) { CircularProgressIndicator(color = BrandPurple) }
        return
    }

    val res = viewModel.reservation

    if (res == null) {
        Box(Modifier.fillMaxSize().background(Color.White), contentAlignment = Alignment.Center) {
            Text("Nenhuma reserva encontrada.", color = Color.Gray, fontSize = 16.sp)
        }
    } else {
        Column(
            modifier = Modifier.fillMaxSize().background(Color(0xFFF5F5F5)).padding(16.dp).verticalScroll(rememberScrollState())
        ) {
            // ... (Mantenha o código do cabeçalho, datas e preço IGUAL ao anterior) ...
            Text("SUA RESERVA ATUAL", color = BrandPurple, fontWeight = FontWeight.Bold, fontSize = 20.sp)
            Spacer(modifier = Modifier.height(16.dp))

            Card(colors = CardDefaults.cardColors(containerColor = Color.White), elevation = CardDefaults.cardElevation(4.dp), shape = RoundedCornerShape(12.dp), modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(16.dp)) {
                    // ... (Copie o conteúdo interno do Card da resposta anterior aqui: Nome, Datas, Valor) ...
                    // Vou resumir para focar no botão:

                    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text(res.room?.name?.uppercase() ?: "QUARTO", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = BrandPurple)
                        Surface(color = if(res.occupied) Color(0xFFE3F2FD) else Color(0xFFE8F5E9), shape = RoundedCornerShape(16.dp)) {
                            Text(viewModel.getStatusLabel(), Modifier.padding(8.dp, 4.dp), style = MaterialTheme.typography.bodySmall, color = if(res.occupied) Color(0xFF1565C0) else Color(0xFF2E7D32), fontWeight = FontWeight.Bold)
                        }
                    }
                    Spacer(modifier = Modifier.height(16.dp))
                    Text("Check-in: ${viewModel.getFormattedCheckin()}")
                    Text("Check-out: ${viewModel.getFormattedCheckout()}")
                    Spacer(modifier = Modifier.height(16.dp))
                    Text("Valor: R$ ${String.format("%.2f", res.price)}", fontWeight = FontWeight.Bold, color = BrandPurple)

                    // --- BOTÃO DE CANCELAR INTELIGENTE ---
                    if (!res.occupied) {
                        Spacer(modifier = Modifier.height(24.dp))

                        OutlinedButton(
                            onClick = {
                                // AQUI ESTÁ A LÓGICA DE DECISÃO
                                if (viewModel.isLateCancellation()) {
                                    showPenaltyDialog = true // Abre o alerta rosa
                                } else {
                                    showStandardDialog = true // Abre o alerta normal
                                }
                            },
                            colors = ButtonDefaults.outlinedButtonColors(contentColor = BrandRed),
                            border = BorderStroke(1.dp, BrandRed),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Icon(Icons.Default.DeleteForever, null)
                            Spacer(Modifier.width(8.dp))
                            Text("CANCELAR RESERVA", fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }
}