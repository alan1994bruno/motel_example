import React from "react";
import styled, { useTheme } from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LogOut } from "lucide-react-native"; // Importe o ícone
import { useUserStore } from "@/store/user-store"; // Importe a store
import { useRouter } from "expo-router";

// 1. ATUALIZAÇÃO NO ESTILO
const SafeContainer = styled(SafeAreaView)`
  background-color: ${({ theme }) => theme.colors.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
  padding: 16px;
  flex-direction: row;
  align-items: center;

  /* MUDANÇA AQUI: space-between joga um item para cada ponta */
  justify-content: space-between;
`;

const LogoContainer = styled.View`
  /* Removemos o align-items: center daqui para o texto alinhar a esquerda */
  align-items: flex-start;
`;

const LogoText = styled.Text`
  font-size: 24px; /* Ajustei levemente para caber melhor com o botão */
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  font-style: italic;
  transform: rotate(-6deg);
`;

const Underline = styled.View`
  height: 4px;
  width: 40px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 2px;
  margin-top: 2px;
`;

// Botão transparente para o ícone
const LogoutButton = styled.TouchableOpacity`
  padding: 8px;
  border-radius: 8px;
  /* Opcional: cor de fundo bem suave ao tocar */
`;

export function Header() {
  const theme = useTheme();
  const router = useRouter();
  const clear = useUserStore((state) => state.clear);

  const handleLogout = () => {
    clear();
    router.replace("/(auth)/login");
  };

  return (
    <SafeContainer edges={["top"]}>
      <LogoContainer>
        <LogoText>Motel</LogoText>
        <Underline />
      </LogoContainer>
      <LogoutButton onPress={handleLogout}>
        <LogOut size={24} color={theme.colors.error} />
      </LogoutButton>
    </SafeContainer>
  );
}
