import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

const SafeContainer = styled(SafeAreaView)`
  background-color: ${({ theme }) => theme.colors.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
  padding: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const LogoContainer = styled.View`
  align-items: center;
`;

const LogoText = styled.Text`
  font-size: 28px;
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

export function Header() {
  return (
    // 3. Use edges para dizer onde proteger (apenas topo)
    <SafeContainer edges={["top"]}>
      <LogoContainer>
        <LogoText>Motel</LogoText>
        <Underline />
      </LogoContainer>
    </SafeContainer>
  );
}
