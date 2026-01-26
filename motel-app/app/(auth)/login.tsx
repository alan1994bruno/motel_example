import { loginUser } from "@/services/auth";
import { useUserStore } from "@/store/user-store";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useRouter } from "expo-router";
import { Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled, { useTheme } from "styled-components/native";
import * as yup from "yup";

const loginSchema = yup.object({
  email: yup
    .string()
    .email("Digite um email válido")
    .required("O email é obrigatório"),
  password: yup
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .required("A senha é obrigatória"),
});

type FormData = yup.InferType<typeof loginSchema>;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.surface};
`;

const ScrollContainer = styled.ScrollView.attrs({
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
})``;

const HeaderContainer = styled.View`
  align-items: center;
  margin-bottom: 40px;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 8px;
`;

const Subtitle = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textLight};
  text-align: center;
`;

const InputWrapper = styled.View`
  margin-bottom: 20px;
`;

const Label = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 8px;
  margin-left: 4px;
`;

const InputContainer = styled.View<{ hasError: boolean }>`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
  border-width: 1px;
  border-color: ${({ theme, hasError }) =>
    hasError ? theme.colors.error : theme.colors.border};
  border-radius: 12px;
  padding: 0 12px;
  height: 56px;
`;

const StyledTextInput = styled.TextInput`
  flex: 1;
  margin-left: 12px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
`;

const ErrorText = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.error};
  margin-top: 4px;
  margin-left: 4px;
`;

const SubmitButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  height: 56px;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  margin-top: 12px;
  margin-bottom: 24px;
  elevation: 2;
  shadow-color: ${({ theme }) => theme.colors.primary};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 4;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Footer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
`;

const FooterText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textLight};
`;

const LinkText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin-left: 4px;
`;

const ForgotPasswordButton = styled.TouchableOpacity`
  align-self: flex-end;
  margin-bottom: 24px;
`;

const ForgotPasswordText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textLight};
`;

export default function LoginScreen() {
  const theme = useTheme();
  const router = useRouter();
  const setToken = useUserStore((state) => state.setToken);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    Keyboard.dismiss();

    try {
      const { token, email } = await loginUser(data);

      setToken(token, email);
    } catch (error) {
      Alert.alert("Erro de Acesso", "Email ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollContainer showsVerticalScrollIndicator={false}>
            <HeaderContainer>
              <Title>Motel</Title>
              <Subtitle>Acesse sua conta para continuar</Subtitle>
            </HeaderContainer>

            <InputWrapper>
              <Label>Email</Label>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputContainer hasError={!!errors.email}>
                    <Mail
                      size={20}
                      color={
                        errors.email
                          ? theme.colors.error
                          : theme.colors.textLight
                      }
                    />
                    <StyledTextInput
                      placeholder="seu@email.com"
                      placeholderTextColor={theme.colors.textLight}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </InputContainer>
                )}
              />
              {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
            </InputWrapper>

            <InputWrapper>
              <Label>Senha</Label>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputContainer hasError={!!errors.password}>
                    <Lock
                      size={20}
                      color={
                        errors.password
                          ? theme.colors.error
                          : theme.colors.textLight
                      }
                    />
                    <StyledTextInput
                      placeholder="••••••"
                      placeholderTextColor={theme.colors.textLight}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableWithoutFeedback
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff size={20} color={theme.colors.textLight} />
                      ) : (
                        <Eye size={20} color={theme.colors.textLight} />
                      )}
                    </TouchableWithoutFeedback>
                  </InputContainer>
                )}
              />
              {errors.password && (
                <ErrorText>{errors.password.message}</ErrorText>
              )}
            </InputWrapper>

            <ForgotPasswordButton
              onPress={() => router.push("/recover-password")}
            >
              <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
            </ForgotPasswordButton>

            <SubmitButton
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <ButtonText>Entrar</ButtonText>
              )}
            </SubmitButton>

            <Footer>
              <FooterText>Não tem uma conta?</FooterText>
              <Link href="/register" asChild>
                <TouchableWithoutFeedback>
                  <LinkText>Cadastre-se</LinkText>
                </TouchableWithoutFeedback>
              </Link>
            </Footer>
          </ScrollContainer>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Container>
  );
}
