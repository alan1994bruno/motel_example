import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Linking, Alert } from "react-native";
import { View, Text } from "react-native";
import styled from "styled-components/native";
import { Header } from "@/components/header";
import { StatusBar } from "expo-status-bar";
import {
  AlertCircle,
  MapPin,
  Wallet,
  AlertTriangle,
} from "lucide-react-native";

// Serviços e Tipos
import { getPenalty } from "@/services/penality"; // Ajuste o caminho se necessário
import { Payment } from "@/@types/penality"; // Ajuste o caminho se necessário

// --- ESTILOS COMPARTILHADOS ---
const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

// --- ESTILOS DA TELA "SEM PENALIDADE" (O que você já tinha) ---
const EmptyContent = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

const EmptyTitle = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.error || "#ef4444"};
  margin-top: 16px;
  margin-bottom: 8px;
`;

const EmptyDescription = styled.Text`
  font-size: 16px;
  color: #374151;
  text-align: center;
  line-height: 24px;
`;

// --- ESTILOS DA TELA "COM PENALIDADE" (Baseado na imagem ba2016.png) ---
const ScrollContent = styled.ScrollView`
  flex: 1;
  padding: 24px;
`;

const AlertIconContainer = styled.View`
  background-color: #fee2e2; /* Fundo vermelho bem claro */
  width: 64px;
  height: 64px;
  border-radius: 32px;
  justify-content: center;
  align-items: center;
  align-self: center;
  margin-bottom: 16px;
`;

const PenaltyTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #4c1d95; /* Roxo */
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 8px;
`;

const PenaltySubtitle = styled.Text`
  font-size: 14px;
  color: #6b7280;
  text-align: center;
  margin-bottom: 32px;
`;

// CARD DE VALOR (ROSA)
const ValueCard = styled.View`
  background-color: #fff1f2; /* Rosa claro */
  border: 1px solid #fecdd3;
  border-radius: 12px;
  padding: 24px;
  align-items: center;
  margin-bottom: 24px;
`;

const ValueLabel = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #4b5563;
  text-transform: uppercase;
  margin-bottom: 8px;
`;

const ValueText = styled.Text`
  font-size: 32px;
  font-weight: 800;
  color: #dc2626; /* Vermelho forte */
  margin-bottom: 8px;
`;

const DateText = styled.Text`
  font-size: 12px;
  color: #ef4444;
`;

// CARD DE BLOQUEIO (Branco com borda vermelha)
const BlockCard = styled.View`
  background-color: #fff;
  border: 1px solid #fca5a5;
  border-radius: 8px;
  padding: 16px;
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 32px;
`;

const BlockContent = styled.View`
  flex: 1;
  margin-left: 12px;
`;

const BlockTitle = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #dc2626;
  margin-bottom: 4px;
`;

const BlockText = styled.Text`
  font-size: 13px;
  color: #7f1d1d;
  line-height: 18px;
`;

// SEÇÃO "COMO PAGAR"
const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 12px;
  flex-direction: row;
  align-items: center;
`;

const PaymentMethodCard = styled.View`
  background-color: #f9fafb;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
`;

const MethodTitle = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #111827;
  margin-bottom: 8px;
`;

const MethodDescription = styled.Text`
  font-size: 14px;
  color: #4b5563;
  line-height: 20px;
`;

const MapButton = styled.TouchableOpacity`
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 14px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
`;

const MapButtonText = styled.Text`
  color: #4b5563;
  font-weight: 600;
  font-size: 16px;
  margin-left: 8px;
`;

export default function PenalidadeScreen() {
  const [penalty, setPenalty] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPenalty();
  }, []);

  const loadPenalty = async () => {
    try {
      const data = await getPenalty();
      setPenalty(data);
    } catch (error) {
      // Se der erro (ex: 404 Not Found), assumimos que não tem penalidade
      console.log("Sem penalidades ou erro ao buscar");
      setPenalty(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("pt-BR");
  };

  const openMap = () => {
    // Abre o maps com uma busca genérica ou latitude/longitude se tiver
    Linking.openURL("https://www.google.com/maps/search/?api=1&query=Motel");
  };

  if (loading) {
    return (
      <Container>
        <Header />
        <LoadingContainer>
          <ActivityIndicator size="large" color="#4c1d95" />
        </LoadingContainer>
      </Container>
    );
  }

  // --- CENÁRIO 1: SEM PENALIDADE (Mostra a tela antiga "Limpa") ---
  if (!penalty) {
    return (
      <Container>
        <Header />
        <EmptyContent>
          <AlertTriangle size={64} color="#ef4444" />
          <EmptyTitle>Política de Penalidade</EmptyTitle>
          <EmptyDescription>
            Cancelamentos feitos com menos de 24h de antecedência estão sujeitos
            a taxa de 50% do valor da reserva.
          </EmptyDescription>

          <EmptyDescription
            style={{ marginTop: 20, color: "#10b981", fontWeight: "bold" }}
          >
            Você não possui pendências no momento.
          </EmptyDescription>
        </EmptyContent>
      </Container>
    );
  }

  // --- CENÁRIO 2: COM PENALIDADE (Design Novo) ---
  return (
    <Container>
      <StatusBar style="dark" />
      <Header />

      <ScrollContent showsVerticalScrollIndicator={false}>
        {/* Ícone de Topo */}
        <AlertIconContainer>
          <AlertCircle size={32} color="#dc2626" />
        </AlertIconContainer>

        <PenaltyTitle>PENDÊNCIA FINANCEIRA</PenaltyTitle>
        <PenaltySubtitle>
          Identificamos uma penalidade em aberto no seu cadastro.
        </PenaltySubtitle>

        {/* Card Rosa de Valor */}
        <ValueCard>
          <ValueLabel>VALOR A REGULARIZAR</ValueLabel>
          <ValueText>R$ {penalty.price.toFixed(2).replace(".", ",")}</ValueText>
          <DateText>Gerada em: {formatDate(penalty.createdAt)}</DateText>
          <DateText style={{ marginTop: 4, color: "#dc2626" }}>
            Motivo: Cancelamento fora do prazo
          </DateText>
        </ValueCard>

        {/* Aviso de Bloqueio */}
        <BlockCard>
          <AlertCircle size={20} color="#dc2626" style={{ marginTop: 2 }} />
          <BlockContent>
            <BlockTitle>Reservas Bloqueadas</BlockTitle>
            <BlockText>
              Você não poderá realizar novas reservas ou check-ins enquanto esta
              pendência não for quitada.
            </BlockText>
          </BlockContent>
        </BlockCard>

        {/* Como Pagar */}
        <SectionTitle>
          <Wallet size={18} color="#000" style={{ marginRight: 8 }} /> Como
          pagar?
        </SectionTitle>

        <PaymentMethodCard>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <MapPin size={20} color="#4c1d95" style={{ marginRight: 8 }} />
            <MethodTitle style={{ marginBottom: 0 }}>
              Pagamento Presencial
            </MethodTitle>
          </View>

          <MethodDescription>
            Para sua segurança, o pagamento deve ser realizado na{" "}
            <Text style={{ fontWeight: "bold" }}>recepção do motel.</Text>
          </MethodDescription>
          <MethodDescription style={{ marginTop: 8, fontSize: 12 }}>
            Aceitamos cartões e Pix. Liberação imediata após pagamento.
          </MethodDescription>
        </PaymentMethodCard>

        {/* Botão Mapa */}
        <MapButton onPress={openMap}>
          <MapPin size={20} color="#4b5563" />
          <MapButtonText>Ver Localização no Mapa</MapButtonText>
        </MapButton>
      </ScrollContent>
    </Container>
  );
}
