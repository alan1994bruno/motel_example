package com.example.motel.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CreditCard
import androidx.compose.material.icons.filled.ErrorOutline
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.motel.viewmodel.PenaltiesViewModel
import androidx.lifecycle.viewmodel.compose.viewModel

@Composable
fun MyPenaltiesScreen(viewModel: PenaltiesViewModel = viewModel()) {
    // --- SIMULAÇÃO DE DADOS ---
    // Mude para TRUE para ver a tela vermelha
    // Mude para FALSE para ver o texto "Nenhuma penalidade encontrada"
    // 1. Carregando
    if (viewModel.isLoading) {
        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator(color = BrandPurple)
        }
        return
    }

    val penalty = viewModel.penalty

    if (penalty == null) {
        // --- ESTADO VAZIO (Nenhuma penalidade) ---
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color.White),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "Nenhuma penalidade encontrada.",
                color = Color.Gray,
                fontSize = 16.sp
            )
        }
    } else {
        // --- TELA DE ALERTA (Tem penalidade) ---
        val scrollState = rememberScrollState()

        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(Color.White)
                .padding(16.dp)
                .verticalScroll(scrollState),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(modifier = Modifier.height(24.dp))

            // Ícone
            Box(
                modifier = Modifier
                    .size(80.dp)
                    .background(Color(0xFFFFEBEE), shape = androidx.compose.foundation.shape.CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.ErrorOutline,
                    contentDescription = null,
                    tint = BrandRed,
                    modifier = Modifier.size(40.dp)
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            Text("PENDÊNCIA FINANCEIRA", color = BrandPurple, fontSize = 22.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                "Identificamos uma penalidade em aberto refente ao quarto ${penalty.room?.name ?: "Desconhecido"}.",
                color = Color.Gray,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(24.dp))

            // CARD DE VALOR
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFFFFEBEE)),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(24.dp).fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text("VALOR A REGULARIZAR", color = BrandPurple, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                    Spacer(modifier = Modifier.height(8.dp))

                    // PREÇO REAL DA API
                    Text("R$ ${String.format("%.2f", penalty.price)}", color = BrandRed, fontWeight = FontWeight.Bold, fontSize = 40.sp)

                    Spacer(modifier = Modifier.height(8.dp))

                    // DATA REAL DA API
                    Text("Gerada em: ${viewModel.getFormattedDate()}", color = BrandRed, fontSize = 12.sp)
                    Text("Motivo: Uso além do tempo contratado", color = BrandRed, fontSize = 12.sp)
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Aviso de Bloqueio
            Card(
                colors = CardDefaults.cardColors(containerColor = Color.White),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFFFCDD2)),
                shape = RoundedCornerShape(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.Top) {
                    Icon(Icons.Default.ErrorOutline, null, tint = BrandRed, modifier = Modifier.size(20.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Column {
                        Text("Reservas Bloqueadas", color = BrandRed, fontWeight = FontWeight.Bold)
                        Text(
                            "Você não poderá realizar novas reservas ou check-ins enquanto esta pendência não for quitada.",
                            color = BrandRed, fontSize = 12.sp, lineHeight = 16.sp
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(32.dp))

            // Como Pagar
            Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.fillMaxWidth()) {
                Icon(Icons.Default.CreditCard, null, tint = BrandPurple)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Como pagar?", fontWeight = FontWeight.Bold, color = BrandPurple, fontSize = 16.sp)
            }

            Spacer(modifier = Modifier.height(16.dp))

            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFFF3F5F9)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(modifier = Modifier.padding(16.dp)) {
                    Icon(Icons.Default.LocationOn, null, tint = BrandPurple)
                    Spacer(modifier = Modifier.width(16.dp))
                    Column {
                        Text("Pagamento Presencial", fontWeight = FontWeight.Bold, color = Color.Black)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            "Para sua segurança, o pagamento deve ser realizado na recepção do motel.",
                            color = Color.Gray, fontSize = 13.sp
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("Aceitamos cartões e Pix. Liberação imediata após pagamento.", fontSize = 11.sp, color = Color.Gray)
                    }
                }
            }
        }
    }

}