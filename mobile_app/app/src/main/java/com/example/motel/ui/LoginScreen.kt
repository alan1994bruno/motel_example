package com.example.motel.ui

import androidx.compose.animation.animateContentSize
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.motel.viewmodel.LoginViewModel

@Composable
fun LoginScreen(
    onLoginSuccess: () -> Unit,
    // O ViewModel é injetado automaticamente aqui
    viewModel: LoginViewModel = viewModel()
) {
    var isLoginTab by remember { mutableStateOf(true) }

    // Estado de rolagem para garantir que telas pequenas vejam tudo
    val scrollState = rememberScrollState()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(scrollState) // Habilita rolagem
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Top // Fixa no topo para evitar "pulos" ao trocar de aba
        ) {

            // Espaço de respiro no topo
            Spacer(modifier = Modifier.height(40.dp))

            // 1. Seletor de Abas (Container Cinza)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(InputGray),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                TabButton(
                    text = "LOGIN",
                    isSelected = isLoginTab,
                    modifier = Modifier.weight(1f),
                    onClick = { isLoginTab = true }
                )
                TabButton(
                    text = "CRIAR CONTA",
                    isSelected = !isLoginTab,
                    modifier = Modifier.weight(1f),
                    onClick = { isLoginTab = false }
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            // 2. Exibição de Erros (Se houver)
            if (viewModel.errorMessage != null) {
                Text(
                    text = viewModel.errorMessage!!,
                    color = Color.Red,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(bottom = 16.dp)
                )
            }

            // 3. Card Principal do Formulário
            Card(
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 8.dp),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .animateContentSize() // Animação suave ao crescer/diminuir
            ) {
                // Barra Roxa decorativa
                Box(modifier = Modifier.fillMaxWidth().height(6.dp).background(BrandPurple))

                Column(modifier = Modifier.padding(24.dp)) {
                    if (isLoginTab) {
                        LoginFormContent(
                            isLoading = viewModel.isLoading,
                            onLoginClick = { email, pass ->
                                viewModel.login(email, pass, onLoginSuccess)
                            }
                        )
                    } else {
                        RegisterFormContent(
                            isLoading = viewModel.isLoading,
                            onRegisterClick = { name, email, pass, cpf, phone ->
                                viewModel.register(name, email, pass, cpf, phone, onLoginSuccess)
                            }
                        )
                    }
                }
            }

            // Espaço extra no final para garantir que o scroll vá até o fim
            Spacer(modifier = Modifier.height(50.dp))
        }

        // 4. Loading (Spinner) Centralizado
        if (viewModel.isLoading) {
            CircularProgressIndicator(
                modifier = Modifier.align(Alignment.Center),
                color = BrandPurple
            )
        }
    }
}

// --- CONTEÚDO DO FORMULÁRIO DE LOGIN ---

@Composable
fun LoginFormContent(
    isLoading: Boolean,
    onLoginClick: (String, String) -> Unit
) {
    var email by remember { mutableStateOf("alanbrunoriosmiguel@gmail.com") }
    var password by remember { mutableStateOf("") }

    Text("Bem-vindo de volta", color = BrandPurple, fontSize = 20.sp, fontWeight = FontWeight.Bold)
    Text("Acesse sua conta para continuar.", color = Color.Gray, fontSize = 14.sp, modifier = Modifier.padding(bottom = 24.dp))

    CustomTextField(label = "Email", value = email, onValueChange = { email = it })
    Spacer(modifier = Modifier.height(16.dp))
    CustomPasswordField(label = "Senha", value = password, onValueChange = { password = it })

    Spacer(modifier = Modifier.height(32.dp))

    Button(
        onClick = { onLoginClick(email, password) },
        enabled = !isLoading,
        colors = ButtonDefaults.buttonColors(containerColor = BrandPurple),
        shape = RoundedCornerShape(10.dp),
        modifier = Modifier.fillMaxWidth().height(50.dp)
    ) {
        if (isLoading) {
            Text("ENTRANDO...", fontWeight = FontWeight.Bold, fontSize = 16.sp)
        } else {
            Text("LOGIN", fontWeight = FontWeight.Bold, fontSize = 16.sp)
        }
    }
}

// --- CONTEÚDO DO FORMULÁRIO DE CADASTRO ---

@Composable
fun RegisterFormContent(
    isLoading: Boolean,
    onRegisterClick: (String, String, String, String, String) -> Unit
) {
    // Estados locais dos campos
    var name by remember { mutableStateOf("") } // Adicionei campo Nome pois geralmente backend pede
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirmPass by remember { mutableStateOf("") } // Apenas visual por enquanto
    var cpf by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }

    Column {
        Text("Criar nova conta", color = BrandPurple, fontSize = 20.sp, fontWeight = FontWeight.Bold)
        Text("Preencha os dados abaixo para se cadastrar.", color = Color.Gray, fontSize = 14.sp, modifier = Modifier.padding(bottom = 24.dp))

        // Adicionei campo Nome (opcional, remova se seu backend não pede)
        CustomTextField(label = "Nome", value = name, onValueChange = { name = it }, placeholder = "Seu nome completo")
        Spacer(modifier = Modifier.height(12.dp))

        CustomTextField(label = "Email", value = email, onValueChange = { email = it }, placeholder = "Insira seu e-mail")
        Spacer(modifier = Modifier.height(12.dp))

        CustomPasswordField(label = "Senha", value = password, onValueChange = { password = it }, placeholder = "Insira sua senha")
        Spacer(modifier = Modifier.height(12.dp))

        CustomPasswordField(label = "Repita Senha", value = confirmPass, onValueChange = { confirmPass = it }, placeholder = "Confirme sua senha")
        Spacer(modifier = Modifier.height(12.dp))

        CustomTextField(label = "CPF", value = cpf, onValueChange = { cpf = it }, placeholder = "Insira seu CPF", keyboardType = KeyboardType.Number)
        Spacer(modifier = Modifier.height(12.dp))

        CustomTextField(label = "Telefone", value = phone, onValueChange = { phone = it }, placeholder = "Insira seu telefone", keyboardType = KeyboardType.Phone)

        Spacer(modifier = Modifier.height(32.dp))

        Button(
            onClick = {
                // Validação simples de senha antes de enviar
                if (password == confirmPass) {
                    onRegisterClick(name, email, password, cpf, phone)
                } else {
                    // Aqui você poderia setar um estado de erro local, por enquanto não faz nada
                }
            },
            enabled = !isLoading,
            colors = ButtonDefaults.buttonColors(containerColor = BrandPurple),
            shape = RoundedCornerShape(10.dp),
            modifier = Modifier.fillMaxWidth().height(50.dp)
        ) {
            Text(if (isLoading) "CRIANDO..." else "CRIAR CONTA", fontWeight = FontWeight.Bold, fontSize = 16.sp)
        }
    }
}

// --- COMPONENTES VISUAIS AUXILIARES ---

@Composable
fun TabButton(text: String, isSelected: Boolean, modifier: Modifier = Modifier, onClick: () -> Unit) {
    Box(
        modifier = modifier
            .padding(4.dp)
            .fillMaxHeight()
            .clip(RoundedCornerShape(10.dp))
            .background(if (isSelected) Color.White else Color.Transparent)
            .clickable { onClick() },
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = text,
            color = if (isSelected) BrandPurple else Color.Black,
            fontWeight = FontWeight.Bold,
            fontSize = 14.sp
        )
    }
}

@Composable
fun CustomTextField(
    label: String,
    value: String = "",
    onValueChange: (String) -> Unit = {},
    placeholder: String = "",
    keyboardType: KeyboardType = KeyboardType.Text
) {
    Column {
        Text(label, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color.Black)
        Spacer(modifier = Modifier.height(6.dp))
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            placeholder = { Text(placeholder, color = Color.Gray) },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(10.dp),
            colors = OutlinedTextFieldDefaults.colors(
                unfocusedContainerColor = InputGray,
                focusedContainerColor = Color.White,
                unfocusedBorderColor = Color.Transparent,
                focusedBorderColor = BrandPurple
            ),
            keyboardOptions = KeyboardOptions(keyboardType = keyboardType),
            singleLine = true
        )
    }
}

@Composable
fun CustomPasswordField(
    label: String,
    value: String = "",
    onValueChange: (String) -> Unit = {},
    placeholder: String = ""
) {
    var passwordVisible by remember { mutableStateOf(false) }
    Column {
        Text(label, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color.Black)
        Spacer(modifier = Modifier.height(6.dp))
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            placeholder = { Text(placeholder, color = Color.Gray) },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(10.dp),
            visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
            trailingIcon = {
                val image = if (passwordVisible) Icons.Default.Visibility else Icons.Default.VisibilityOff
                IconButton(onClick = { passwordVisible = !passwordVisible }) {
                    Icon(image, null, tint = Color.Gray)
                }
            },
            colors = OutlinedTextFieldDefaults.colors(
                unfocusedContainerColor = InputGray,
                focusedContainerColor = Color.White,
                unfocusedBorderColor = Color.Transparent,
                focusedBorderColor = BrandPurple
            ),
            singleLine = true
        )
    }
}