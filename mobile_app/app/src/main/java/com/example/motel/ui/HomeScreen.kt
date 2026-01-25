package com.example.motel.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material3.*
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.motel.model.Suite
import com.example.motel.viewmodel.HomeViewModel

// Mudei o nome para deixar claro que é só o CONTEÚDO (sem barra de topo)
@Composable
fun HomeScreenContentOnly(
    viewModel: HomeViewModel,
    onSuiteClick: (String) -> Unit
) {
    Box(modifier = Modifier.fillMaxSize().background(BackgroundWhite)) {

        if (viewModel.isLoading) {
            CircularProgressIndicator(modifier = Modifier.align(Alignment.Center), color = BrandPurple)
        } else if (viewModel.errorMessage != null) {
            Column(modifier = Modifier.align(Alignment.Center), horizontalAlignment = Alignment.CenterHorizontally) {
                Text("Erro ao carregar", color = Color.Red)
                Button(onClick = { viewModel.fetchRooms() }) { Text("Tentar Novamente") }
            }
        } else {
            LazyColumn(
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                item {
                    Text("SUÍTES DISPONÍVEIS", color = BrandPurple, fontSize = 20.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(bottom = 8.dp))
                }

                items(viewModel.suites) { suite ->
                    SuiteCard(suite, onSuiteClick)
                }

                item {
                    Spacer(modifier = Modifier.height(16.dp))
                    LocationSection()
                    Spacer(modifier = Modifier.height(16.dp))
                }
            }
        }
    }
}

// Mantenha SuiteCard e LocationSection iguais...
@Composable
fun SuiteCard(suite: Suite, onClick: (String) -> Unit) {
    /* ... Seu código do Card aqui ... */
    Card(
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        shape = RoundedCornerShape(12.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column {
            Box(
                modifier = Modifier.fillMaxWidth().height(200.dp).background(Color.LightGray),
                contentAlignment = Alignment.Center
            ) {
                if (suite.imageUrl != null) {
                    AsyncImage(
                        model = suite.imageUrl,
                        contentDescription = suite.name,
                        modifier = Modifier.fillMaxSize(),
                        contentScale = ContentScale.Crop
                    )
                } else {
                    Icon(Icons.Default.Home, null, tint = Color.White, modifier = Modifier.size(64.dp))
                }
            }
            Column(modifier = Modifier.padding(16.dp)) {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                    Text(suite.name, fontSize = 22.sp, fontWeight = FontWeight.Bold, color = Color.Black)
                    Text("R$ ${String.format("%.2f", suite.price)}", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = BrandPurple)
                }
                Spacer(modifier = Modifier.height(4.dp))
                Text(suite.description, fontSize = 12.sp, color = Color.Gray, lineHeight = 16.sp)
                Spacer(modifier = Modifier.height(16.dp))
                Button(
                    onClick = { onClick(suite.id) },
                    colors = ButtonDefaults.buttonColors(containerColor = BrandRed),
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(8.dp)
                ) { Text("VER SUÍTE", fontWeight = FontWeight.Bold) }
            }
        }
    }
}

@Composable
fun LocationSection() {
    Card(
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp), // Remove sombra se quiser flat
        colors = CardDefaults.cardColors(containerColor = Color.Transparent), // Fundo transparente para integrar
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier.fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                // CORREÇÃO AQUI: Use apenas 'Icon' (do Material 3)
                Icon(
                    imageVector = Icons.Default.Home,
                    contentDescription = null,
                    tint = BrandPurple,
                    modifier = Modifier.size(24.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "LOCALIZAÇÃO",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = BrandPurple
                )
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "Fácil acesso e discrição total. Venha nos visitar.",
                fontSize = 14.sp,
                color = Color.Gray,
                textAlign = androidx.compose.ui.text.style.TextAlign.Center
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Card cinza simulando o mapa/logo
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp)
                    .background(Color(0xFFE0E0E0), shape = RoundedCornerShape(12.dp)),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = "Motel",
                        fontSize = 32.sp,
                        fontWeight = FontWeight.Bold,
                        color = BrandPurple,
                        fontStyle = androidx.compose.ui.text.font.FontStyle.Italic
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "UNIDADE MATRIZ\nFeira de Santana - BA",
                        textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                        fontWeight = FontWeight.Bold,
                        color = Color.Gray
                    )
                }
            }
        }
    }
}