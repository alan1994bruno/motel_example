import { Header } from "@/components/header";
import { useUserStore } from "@/store/user-store";
import { useRouter } from "expo-router";
import React from "react";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Content = styled.View`
  padding: 24px;
  align-items: center;
`;

const UserText = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 32px;
`;

const LogoutButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.error};
  padding: 16px 32px;
  border-radius: 8px;
  width: 100%;
  align-items: center;
`;

const LogoutText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 16px;
`;

export default function ProfileScreen() {
  const { email, clear, isAuthenticated } = useUserStore();
  const router = useRouter();

  const handleLogout = () => {
    clear(); // Limpa Zustand e SecureStore
    router.replace("/(auth)/login");
  };

  if (!isAuthenticated) {
    // Se permitir navegar sem logar, mostre botão de login aqui
    return (
      <Container>
        <Header />
        <Content>
          <UserText>Você não está logado.</UserText>
          <LogoutButton
            style={{ backgroundColor: "#4c1d95" }}
            onPress={() => router.push("/(auth)/login")}
          >
            <LogoutText>Fazer Login</LogoutText>
          </LogoutButton>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Header />
      <Content>
        <UserText>Logado como: {email}</UserText>

        <LogoutButton onPress={handleLogout}>
          <LogoutText>Sair do App</LogoutText>
        </LogoutButton>
      </Content>
    </Container>
  );
}
