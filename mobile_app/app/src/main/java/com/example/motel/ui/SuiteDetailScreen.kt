package com.example.motel.ui

import android.app.DatePickerDialog
import android.widget.DatePicker
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.CalendarToday
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import coil.compose.AsyncImage
import com.example.motel.viewmodel.SuiteDetailViewModel
import java.time.LocalDate
import java.time.LocalTime
import java.time.format.DateTimeFormatter
import java.util.Calendar

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SuiteDetailScreen(
    suiteId: String,
    onBack: () -> Unit,
    viewModel: SuiteDetailViewModel = viewModel()
) {
    // 1. Carrega os dados da suíte ao abrir a tela
    LaunchedEffect(suiteId) { viewModel.loadSuite(suiteId) }

    LaunchedEffect(viewModel.reservationState) {
        viewModel.reservationState?.onSuccess {
            // Se deu sucesso, volta para a tela anterior (Home)
            onBack()
        }
    }

    val scrollState = rememberScrollState()
    val context = LocalContext.current

    // Controle de visibilidade dos nossos Dialogs Customizados
    var showStartTimePicker by remember { mutableStateOf(false) }
    var showEndTimePicker by remember { mutableStateOf(false) }

    // Configuração do Calendário Nativo (Data ainda usa o nativo pois é complexo)
    val calendar = Calendar.getInstance()
    val datePickerDialog = DatePickerDialog(
        context,
        { _: DatePicker, year: Int, month: Int, dayOfMonth: Int ->
            viewModel.validateAndSetDate(LocalDate.of(year, month + 1, dayOfMonth))
        },
        calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH), calendar.get(Calendar.DAY_OF_MONTH)
    )
    // Trava datas anteriores a hoje + 3 dias
    datePickerDialog.datePicker.minDate = System.currentTimeMillis() + (3 * 24 * 60 * 60 * 1000)

    // --- CHAMADA DOS DIALOGS DE HORA CUSTOMIZADOS ---

    if (showStartTimePicker) {
        HourSelectionDialog(
            title = "Horário de Entrada",
            // Se for null, passa -1 para nenhum ficar selecionado visualmente
            currentHour = viewModel.startTime?.hour ?: -1,
            onHourSelected = { hour ->
                viewModel.validateAndSetTime(LocalTime.of(hour, 0), viewModel.endTime)
                showStartTimePicker = false
            },
            onDismiss = { showStartTimePicker = false }
        )
    }

    if (showEndTimePicker) {
        HourSelectionDialog(
            title = "Horário de Saída",
            currentHour = viewModel.endTime?.hour ?: -1,
            onHourSelected = { hour ->
                viewModel.validateAndSetTime(viewModel.startTime, LocalTime.of(hour, 0))
                showEndTimePicker = false
            },
            onDismiss = { showEndTimePicker = false }
        )
    }

    // --- UI DA TELA ---
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(viewModel.suite?.name?.uppercase() ?: "DETALHES", fontWeight = FontWeight.Bold, color = BrandPurple) },
                navigationIcon = { IconButton(onClick = onBack) { Icon(Icons.Default.ArrowBack, "Voltar", tint = BrandPurple) } },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.White)
            )
        }
    ) { innerPadding ->

        if (viewModel.isLoading) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = BrandPurple)
            }
        } else {
            Column(
                modifier = Modifier
                    .padding(innerPadding)
                    .verticalScroll(scrollState)
                    .fillMaxSize()
                    .background(Color(0xFFF9F9F9)) // Fundo cinza bem clarinho
            ) {
                // 1. CARROSSEL DE IMAGENS
                val images = viewModel.getImageList()
                if (images.isNotEmpty()) {
                    val pagerState = rememberPagerState(pageCount = { images.size })

                    Box(modifier = Modifier.height(250.dp).fillMaxWidth()) {
                        HorizontalPager(state = pagerState, modifier = Modifier.fillMaxSize()) { page ->
                            AsyncImage(
                                model = images[page],
                                contentDescription = null,
                                contentScale = ContentScale.Crop,
                                modifier = Modifier.fillMaxSize()
                            )
                        }

                        // Indicador de bolinhas
                        Row(
                            Modifier.align(Alignment.BottomCenter).padding(bottom = 8.dp),
                            horizontalArrangement = Arrangement.Center
                        ) {
                            repeat(pagerState.pageCount) { iteration ->
                                val color = if (pagerState.currentPage == iteration) BrandRed else Color.White
                                Box(modifier = Modifier.padding(2.dp).clip(CircleShape).background(color).size(8.dp))
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    "Arraste para o lado para ver mais fotos",
                    fontSize = 12.sp, color = Color.Gray,
                    modifier = Modifier.fillMaxWidth(),
                    textAlign = androidx.compose.ui.text.style.TextAlign.Center
                )

                Spacer(modifier = Modifier.height(24.dp))

                // 2. CARD DE RESERVA
                Card(
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier.padding(16.dp).fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(24.dp)) {
                        Text("RESERVAR ${viewModel.suite?.name?.uppercase()}", color = BrandPurple, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                        Text("Planeje seu momento especial com antecedência.", color = Color.Gray, fontSize = 12.sp)

                        Spacer(modifier = Modifier.height(16.dp))

                        // PREÇO POR HORA
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(Color(0xFFF3E5F5), RoundedCornerShape(8.dp))
                                .padding(16.dp),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("Valor por hora:", color = BrandPurple, fontWeight = FontWeight.Bold)
                            Text("R$ ${String.format("%.2f", viewModel.suite?.price)}", color = BrandRed, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        // SELETOR DE DATA
                        Text("Data da Reserva", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = BrandPurple)
                        Spacer(modifier = Modifier.height(4.dp))
                        OutlinedButton(
                            onClick = { datePickerDialog.show() },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Icon(Icons.Default.CalendarToday, null, tint = Color.Gray)
                            Spacer(Modifier.width(8.dp))

                            val dateText = viewModel.selectedDate?.format(DateTimeFormatter.ofPattern("dd 'de' MMMM 'de' yyyy")) ?: "Selecione uma data"
                            val dateColor = if (viewModel.selectedDate == null) Color.Gray else Color.Black

                            Text(text = dateText, color = dateColor)
                        }
                        Text("*Reservas apenas com 3 dias de antecedência.", fontSize = 10.sp, color = Color.Gray)

                        Spacer(modifier = Modifier.height(16.dp))

                        // SELETORES DE HORA (Lado a Lado)
                        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                            // Coluna Entrada
                            Column(Modifier.weight(1f)) {
                                Text("Entrada", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = BrandPurple)
                                OutlinedButton(
                                    onClick = { showStartTimePicker = true },
                                    shape = RoundedCornerShape(8.dp),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    // Lógica visual: Se for null mostra "Selecione" em cinza
                                    val text = viewModel.startTime?.format(DateTimeFormatter.ofPattern("HH:mm")) ?: "Selecione"
                                    val color = if (viewModel.startTime == null) Color.Gray else Color.Black
                                    Text(text, color = color)
                                }
                            }

                            // Coluna Saída
                            Column(Modifier.weight(1f)) {
                                Text("Saída", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = BrandPurple)
                                OutlinedButton(
                                    onClick = { showEndTimePicker = true },
                                    shape = RoundedCornerShape(8.dp),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    val text = viewModel.endTime?.format(DateTimeFormatter.ofPattern("HH:mm")) ?: "Selecione"
                                    val color = if (viewModel.endTime == null) Color.Gray else Color.Black
                                    Text(text, color = color)
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(24.dp))
                        Divider()
                        Spacer(modifier = Modifier.height(16.dp))

                        // TOTAL
                        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                            Text("Total estimado:", color = Color.Gray)
                            Text("R$ ${String.format("%.2f", viewModel.totalPrice)}", color = BrandRed, fontWeight = FontWeight.Bold, fontSize = 20.sp)
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        // BOTÃO CONFIRMAR (Só habilita se tudo estiver preenchido)
                        Button(
                            onClick = {
                                viewModel.createReservation()
                            },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = BrandRed,
                                disabledContainerColor = Color.LightGray
                            ),
                            modifier = Modifier.fillMaxWidth().height(50.dp),
                            shape = RoundedCornerShape(8.dp),
                            enabled = viewModel.isValid() // Trava o botão
                        ) {
                            if (viewModel.isLoading) {
                                CircularProgressIndicator(color = Color.White, modifier = Modifier.size(24.dp))
                            } else {
                                Text("CONFIRMAR RESERVA", fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
                Spacer(Modifier.height(30.dp))
            }
        }
    }
}

// --- COMPONENTE CUSTOMIZADO: GRADE DE HORAS ---
@Composable
fun HourSelectionDialog(
    title: String,
    currentHour: Int,
    onHourSelected: (Int) -> Unit,
    onDismiss: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(title, color = BrandPurple, fontWeight = FontWeight.Bold, fontSize = 18.sp) },
        text = {
            // Grade com 4 colunas
            LazyVerticalGrid(
                columns = GridCells.Fixed(4),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.height(300.dp)
            ) {
                items(24) { hour ->
                    val isSelected = hour == currentHour
                    // Cores mudam se estiver selecionado
                    val containerColor = if (isSelected) BrandRed else Color.White
                    val contentColor = if (isSelected) Color.White else BrandPurple
                    val borderColor = if (isSelected) Color.Transparent else BrandPurple

                    OutlinedButton(
                        onClick = { onHourSelected(hour) },
                        colors = ButtonDefaults.outlinedButtonColors(
                            containerColor = containerColor,
                            contentColor = contentColor
                        ),
                        border = androidx.compose.foundation.BorderStroke(1.dp, borderColor),
                        contentPadding = PaddingValues(0.dp),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text(
                            text = String.format("%02d:00", hour),
                            fontWeight = FontWeight.Bold,
                            fontSize = 12.sp
                        )
                    }
                }
            }
        },
        confirmButton = {
            TextButton(onClick = onDismiss) { Text("Cancelar", color = Color.Gray) }
        },
        containerColor = Color.White
    )
}