import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import styled from "styled-components/native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Mail, Key, Lock, ArrowLeft, CheckCircle } from "lucide-react-native";

// Serviços
import { forgotPassword, resetPassword } from "@/services/auth";
import { isAxiosError } from "axios";

// --- ESTILOS VISUAIS IDÊNTICOS ÀS IMAGENS ---
const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #fff;
`;

const ScrollContent = styled.ScrollView`
  flex: 1;
`;

const HeaderTitle = styled.Text`
  font-size: 26px;
  font-weight: bold;
  color: #4c1d95; /* Roxo Escuro */
  text-align: center;
  margin-bottom: 8px;
`;

const Description = styled.Text`
  font-size: 15px;
  color: #6b7280; /* Cinza */
  text-align: center;
  margin-bottom: 32px;
  line-height: 22px;
`;

const Label = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 8px;
  margin-top: 4px;
`;

const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  background-color: #f9fafb;
  margin-bottom: 16px;
`;

const Input = styled.TextInput`
  flex: 1;
  font-size: 16px;
  color: #374151;
  margin-left: 10px;
`;

const ActionButton = styled.TouchableOpacity`
  background-color: #4c1d95; /* Roxo */
  padding: 16px;
  border-radius: 8px;
  align-items: center;
  margin-top: 16px;
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};
`;

const ButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
`;

const BackButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
  padding: 10px;
`;

const BackText = styled.Text`
  color: #6b7280;
  font-size: 14px;
  margin-left: 6px;
`;

export default function RecoverPasswordScreen() {
  const router = useRouter();

  // Controle de Etapas (1 = Email, 2 = Redefinir)
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  // Estados dos Campos
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // --- ETAPA 1: ENVIAR CÓDIGO ---
  const handleSendCode = async () => {
    if (!email) {
      Alert.alert("Atenção", "Por favor, informe seu email.");
      return;
    }

    setLoading(true);
    try {
      // 1. Chama a API para enviar o código
      await forgotPassword(email);

      Alert.alert("Código Enviado", `Verifique a caixa de entrada de ${email}`);
      // 2. Avança para a tela de digitar código
      setStep(2);
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível enviar o código. Verifique o email digitado.",
      );
    } finally {
      setLoading(false);
    }
  };

  // --- ETAPA 2: REDEFINIR SENHA ---
  const handleResetPassword = async () => {
    // Validações básicas
    if (!code || !newPassword || !confirmPassword) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      // 3. Chama a API de redefinição
      await resetPassword({
        code: code,
        newPassword: newPassword,
      });

      // 4. Sucesso! Volta para Login
      Alert.alert("Sucesso", "Sua senha foi alterada! Faça login agora.", [
        {
          text: "Ir para Login",
          onPress: () => router.replace("/(auth)/login"),
        },
      ]);
    } catch (error) {
      if (isAxiosError(error) && error?.status && error.response?.data) {
        if (error.response?.data?.newPassword) {
          Alert.alert("Falha", error.response?.data?.newPassword);
        } else {
          Alert.alert("Falha", "Código inválido");
        }
      } else {
        Alert.alert("Falha", "Código inválido ou expirado.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollContent
          contentContainerStyle={{
            flexGrow: 1,
            padding: 16,
            justifyContent: "center",
          }}
        >
          {/* TÍTULO MUDAM CONFORME A ETAPA */}
          <HeaderTitle>
            {step === 1 ? "Recuperar Senha" : "Redefinir Senha"}
          </HeaderTitle>

          <Description>
            {step === 1
              ? "Informe seu email para receber o código de verificação."
              : `Informe o código enviado para ${email} e sua nova senha.`}
          </Description>

          {/* --- FORMULÁRIO ETAPA 1 (EMAIL) --- */}
          {step === 1 && (
            <>
              <Label>Email</Label>
              <InputContainer>
                <Mail size={20} color="#9ca3af" />
                <Input
                  placeholder="seu@email.com"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </InputContainer>

              <ActionButton onPress={handleSendCode} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <ButtonText>Próximo</ButtonText>
                )}
              </ActionButton>

              <BackButton onPress={() => router.back()}>
                <ArrowLeft size={18} color="#6b7280" />
                <BackText>Voltar para Login</BackText>
              </BackButton>
            </>
          )}

          {/* --- FORMULÁRIO ETAPA 2 (CÓDIGO + SENHAS) --- */}
          {step === 2 && (
            <>
              <Label>Código de Verificação</Label>
              <InputContainer>
                <Key size={20} color="#9ca3af" />
                <Input
                  placeholder="Ex: 123456"
                  value={code}
                  onChangeText={setCode}
                  keyboardType="number-pad"
                />
              </InputContainer>

              <Label>Nova Senha</Label>
              <InputContainer>
                <Lock size={20} color="#9ca3af" />
                <Input
                  placeholder="••••••"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
              </InputContainer>

              <Label>Confirmar Senha</Label>
              <InputContainer>
                <CheckCircle size={20} color="#9ca3af" />
                <Input
                  placeholder="••••••"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </InputContainer>

              <ActionButton onPress={handleResetPassword} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <ButtonText>Trocar Senha</ButtonText>
                )}
              </ActionButton>

              {/* Botão para corrigir email se o usuário errou */}
              <BackButton onPress={() => setStep(1)}>
                <BackText>Corrigir email</BackText>
              </BackButton>
            </>
          )}
        </ScrollContent>
      </KeyboardAvoidingView>
    </Container>
  );
}
