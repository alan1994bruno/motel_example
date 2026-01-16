package com.example.motel.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Place
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.motel.model.Suite
import com.example.motel.model.mockSuites

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(onLogout: () -> Unit) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Motel", fontWeight = FontWeight.Bold, color = Color.White) },
                actions = { IconButton(onClick = onLogout) { Icon(Icons.Default.Close, "Sair", tint = Color.White) } },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = BrandPurple)
            )
        },
        containerColor = BackgroundWhite
    ) { innerPadding ->
        LazyColumn(
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            modifier = Modifier.padding(innerPadding)
        ) {
            item {
                Text("SUÍTES DISPONÍVEIS", color = BrandPurple, fontSize = 20.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(bottom = 8.dp))
            }
            items(mockSuites) { suite -> SuiteCard(suite) }
            item {
                Spacer(modifier = Modifier.height(16.dp))
                LocationSection()
                Spacer(modifier = Modifier.height(16.dp))
            }
        }
    }
}

@Composable
fun SuiteCard(suite: Suite) {
    Card(
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        shape = RoundedCornerShape(12.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column {
            Box(
                modifier = Modifier.fillMaxWidth().height(180.dp).background(Color.Gray),
                contentAlignment = Alignment.Center
            ) {
                Icon(Icons.Default.Home, null, tint = Color.White, modifier = Modifier.size(64.dp))
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
                    onClick = { },
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
    Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()) {
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.Center) {
            Icon(Icons.Default.Place, null, tint = BrandPurple, modifier = Modifier.size(28.dp))
            Spacer(modifier = Modifier.width(8.dp))
            Text("LOCALIZAÇÃO", color = BrandPurple, fontSize = 22.sp, fontWeight = FontWeight.Bold)
        }
        Spacer(modifier = Modifier.height(8.dp))
        Text("Fácil acesso e discrição total. Venha nos visitar.", color = Color.Gray, fontSize = 14.sp, textAlign = TextAlign.Center)
        Spacer(modifier = Modifier.height(16.dp))
        Box(
            modifier = Modifier.fillMaxWidth().height(250.dp).clip(RoundedCornerShape(12.dp)).background(Color(0xFFDDDDDD)),
            contentAlignment = Alignment.Center
        ) {
            Text("Visualização do Mapa", color = Color.Gray.copy(alpha = 0.5f))
            Card(
                elevation = CardDefaults.cardElevation(defaultElevation = 8.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.wrapContentSize().padding(32.dp)
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.padding(vertical = 24.dp, horizontal = 40.dp)) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("Motel", color = BrandPurple, fontSize = 28.sp, fontWeight = FontWeight.ExtraBold, fontStyle = FontStyle.Italic)
                        Box(modifier = Modifier.width(40.dp).height(3.dp).background(BrandPurple))
                    }
                    Spacer(modifier = Modifier.height(16.dp))
                    Text("UNIDADE MATRIZ", color = Color.Gray, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    Text("Feira de Santana - BA", color = Color.Gray, fontSize = 12.sp)
                }
            }
        }
    }
}