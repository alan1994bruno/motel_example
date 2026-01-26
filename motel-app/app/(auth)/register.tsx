import React from "react";
import styled from "styled-components/native";
import { useRouter, Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity } from "react-native";

// Reutilizando seus componentes estilizados básicos
const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.surface};
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 20px;
`;

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <Container>
      <Title>Criar Conta</Title>

      <Link href="/(auth)/login" asChild>
        <TouchableOpacity>
          <Text style={{ color: "#4c1d95", fontSize: 16 }}>
            Voltar para Login
          </Text>
        </TouchableOpacity>
      </Link>
    </Container>
  );
}
