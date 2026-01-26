import React, { useState, useCallback } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  RefreshControl,
  View,
  Alert,
} from "react-native";
import styled from "styled-components/native";
import { useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Calendar, Clock, MapPin, AlertTriangle } from "lucide-react-native";

// Imports (Mantenha os seus)
import { Header } from "@/components/header";
import { cancelReservation, getMyReservation } from "@/services/reservation";
import { ReservationSummary } from "@/@types/reresvation";

// --- ESTILOS DA TELA (Mantidos iguais aos anteriores) ---
const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;
const Content = styled.ScrollView`
  flex: 1;
  padding: 20px;
`;
const HeaderSection = styled.View`
  margin-bottom: 24px;
`;
const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #4c1d95;
  margin-bottom: 4px;
  text-transform: uppercase;
`;
const Subtitle = styled.Text`
  font-size: 14px;
  color: #6b7280;
`;
const ReservationCard = styled.View`
  background-color: #fff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 16px;
  margin-bottom: 24px;
  elevation: 2;
`;
const BadgeContainer = styled.View`
  position: absolute;
  top: 16px;
  right: 16px;
  background-color: #10b981;
  padding: 4px 12px;
  border-radius: 16px;
  z-index: 10;
`;
const BadgeText = styled.Text`
  color: #fff;
  font-size: 12px;
  font-weight: bold;
`;
const CardContent = styled.View`
  flex-direction: row;
  margin-top: 12px;
`;
const RoomImage = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 8px;
  background-color: #f3f4f6;
`;
const InfoColumn = styled.View`
  flex: 1;
  margin-left: 16px;
  justify-content: center;
`;
const RoomName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 12px;
`;
const InfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;
const InfoText = styled.Text`
  font-size: 13px;
  color: #4b5563;
  margin-left: 6px;
`;
const PriceContainer = styled.View`
  background-color: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;
const PriceLabel = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #374151;
`;
const PriceValue = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #4c1d95;
`;
const PolicyCard = styled.View`
  background-color: #fff7ed;
  border: 1px solid #fdba74;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 32px;
`;
const PolicyHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;
const PolicyTitle = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #c2410c;
  margin-left: 8px;
`;
const PolicyText = styled.Text`
  font-size: 13px;
  color: #9a3412;
  line-height: 20px;
`;

const CancelButton = styled.TouchableOpacity`
  background-color: #dc2626;
  padding: 16px;
  border-radius: 8px;
  align-items: center;
  margin-bottom: 40px;
`;
const CancelText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
`;

// --- ESTILOS DO MODAL DE CANCELAMENTO ---
const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ModalCard = styled.View`
  background-color: #fff;
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 400px;
`;

const ModalTitle = styled.Text<{ isDanger?: boolean }>`
  font-size: 20px;
  font-weight: bold;
  color: ${({ isDanger }) =>
    isDanger ? "#dc2626" : "#be123c"}; /* Vermelho conforme img */
  margin-bottom: 16px;
`;

const ModalText = styled.Text`
  font-size: 15px;
  color: #374151;
  line-height: 22px;
  margin-bottom: 20px;
`;

// Caixa de cálculo (Igual Imagem 2)
const CalculationBox = styled.View`
  background-color: #fff1f2; /* Fundo rosa claro */
  border: 1px solid #fecdd3;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
`;

const CalcRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const CalcLabel = styled.Text<{ isBold?: boolean; color?: string }>`
  font-size: 14px;
  color: ${({ color }) => color || "#374151"};
  font-weight: ${({ isBold }) => (isBold ? "bold" : "normal")};
`;

const CalcTotalRow = styled(CalcRow)`
  margin-top: 8px;
  padding-top: 12px;
  border-top-width: 1px;
  border-top-color: #fecdd3;
`;

const ModalFooter = styled.View`
  flex-direction: column;
  justify-content: flex-end;
  gap: 12px;
`;

const BackButton = styled.TouchableOpacity`
  padding: 12px 20px;
  border: 1px solid #e5e7eb;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: #0aeb0a;
  border-radius: 8px;
`;

const ConfirmButton = styled.TouchableOpacity`
  padding: 12px 20px;
  background-color: #be123c;
  border-radius: 8px;
`;

// --- COMPONENTE TELA ---
export default function MinhaReservaScreen() {
  const [reservation, setReservation] = useState<ReservationSummary | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [canceling, setCanceling] = useState(false);

  // Estado para controlar o Modal
  const [modalVisible, setModalVisible] = useState(false);

  const fetchReservation = async () => {
    try {
      const data = await getMyReservation();
      setReservation(data);
    } catch {
      setReservation(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchReservation();
    }, []),
  );

  // --- LÓGICA DO CÁLCULO DE 48H ---
  const getHoursUntilCheckin = () => {
    if (!reservation) return 0;
    const now = new Date();
    const checkin = new Date(reservation.checkinTime);
    const diffMs = checkin.getTime() - now.getTime();
    return diffMs / (1000 * 60 * 60); // Converte ms para horas
  };

  const hoursUntil = getHoursUntilCheckin();
  const hasPenalty = hoursUntil < 48; // Regra: Menos de 48h tem multa

  const confirmCancellation = async () => {
    if (!reservation?.publicId) return;

    setCanceling(true); // Ativa loading no botão
    try {
      // CHAMADA REAL DA API
      await cancelReservation(reservation.publicId);

      Alert.alert("Sucesso", "Reserva cancelada com sucesso.");
      setModalVisible(false);
      setReservation(null); // Limpa a tela
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Erro",
        "Não foi possível cancelar a reserva. Tente novamente.",
      );
    } finally {
      setCanceling(false);
    }
  };

  // Formatadores
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  const formatTimeRange = (start: string, end: string) => {
    const s = new Date(start).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const e = new Date(end).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${s} às ${e}`;
  };

  if (loading)
    return (
      <ActivityIndicator style={{ flex: 1 }} size="large" color="#4c1d95" />
    );

  if (!reservation)
    return (
      <Container>
        <Header />
        <Content
          contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Title>Nenhuma Reserva</Title>
        </Content>
      </Container>
    );

  return (
    <Container>
      <StatusBar style="dark" />
      <Header />

      <Content
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchReservation();
            }}
          />
        }
      >
        <HeaderSection>
          <Title>MINHA RESERVA</Title>
          <Subtitle>Gerencie os detalhes do seu agendamento.</Subtitle>
        </HeaderSection>

        {/* Card Principal */}
        <ReservationCard>
          <BadgeContainer>
            <BadgeText>Confirmado</BadgeText>
          </BadgeContainer>
          <RoomName>{reservation.room.name}</RoomName>
          <CardContent>
            <RoomImage source={{ uri: reservation.room.images?.[0]?.url }} />
            <InfoColumn>
              <InfoRow>
                <Calendar size={14} color="#dc2626" />
                <InfoText>{formatDate(reservation.checkinTime)}</InfoText>
              </InfoRow>
              <InfoRow>
                <Clock size={14} color="#dc2626" />
                <InfoText>
                  {formatTimeRange(
                    reservation.checkinTime,
                    reservation.checkoutTime,
                  )}
                </InfoText>
              </InfoRow>
              <InfoRow>
                <MapPin size={14} color="#dc2626" />
                <InfoText>Unidade Matriz</InfoText>
              </InfoRow>
            </InfoColumn>
          </CardContent>
        </ReservationCard>

        {/* Card de Valor */}
        <PriceContainer>
          <PriceLabel>Valor Total</PriceLabel>
          <PriceValue>
            R$ {reservation.price.toFixed(2).replace(".", ",")}
          </PriceValue>
        </PriceContainer>

        {/* Card Política - SÓ APARECE SE TIVER DENTRO DO PRAZO DE MULTA? 
            Geralmente é bom sempre mostrar a regra, mas vou manter. */}
        <PolicyCard>
          <PolicyHeader>
            <AlertTriangle size={18} color="#c2410c" />
            <PolicyTitle>Política de Cancelamento</PolicyTitle>
          </PolicyHeader>
          <PolicyText>
            Cancelamentos com{" "}
            <CalcLabel isBold>menos de 2 dias (48h)</CalcLabel> de antecedência
            estão sujeitos a multa de 50%.
          </PolicyText>
        </PolicyCard>

        <CancelButton onPress={() => setModalVisible(true)}>
          <CancelText>Cancelar Reserva</CancelText>
        </CancelButton>
      </Content>

      {/* --- MODAL DE DECISÃO --- */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <ModalOverlay>
          <ModalCard>
            {/* TÍTULO DINÂMICO */}
            <ModalTitle isDanger={hasPenalty}>
              {hasPenalty
                ? "Atenção: Penalidade Aplicável"
                : "Confirmar Cancelamento"}
            </ModalTitle>

            {/* MENSAGEM DINÂMICA */}
            <ModalText>
              {hasPenalty
                ? "Você está tentando cancelar com menos de 48 horas de antecedência. Conforme nossa política, será cobrada uma multa."
                : "Tem certeza que deseja cancelar sua reserva? Como faltam mais de 48 horas, não haverá cobrança de multa."}
            </ModalText>

            {/* BOX DE CÁLCULO (SÓ SE TIVER MULTA) */}
            {hasPenalty && (
              <CalculationBox>
                <CalcRow>
                  <CalcLabel>Valor Reserva:</CalcLabel>
                  <CalcLabel>
                    R$ {reservation.price.toFixed(2).replace(".", ",")}
                  </CalcLabel>
                </CalcRow>

                <CalcRow>
                  <CalcLabel isBold color="#dc2626">
                    + Multa (50%):
                  </CalcLabel>
                  <CalcLabel isBold color="#dc2626">
                    R$ {(reservation.price * 0.5).toFixed(2).replace(".", ",")}
                  </CalcLabel>
                </CalcRow>

                <CalcTotalRow>
                  <CalcLabel isBold size={16} color="#be123c">
                    Total a Pagar:
                  </CalcLabel>
                  <CalcLabel isBold size={18} color="#be123c">
                    R$ {(reservation.price * 1.5).toFixed(2).replace(".", ",")}
                  </CalcLabel>
                </CalcTotalRow>
              </CalculationBox>
            )}

            {/* RODAPÉ */}
            <ModalFooter>
              <ConfirmButton onPress={confirmCancellation} disabled={canceling}>
                {canceling ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <CancelText style={{ fontSize: 14 }}>
                    {hasPenalty
                      ? "Aceitar Multa e Cancelar"
                      : "Confirmar Cancelamento"}
                  </CancelText>
                )}
              </ConfirmButton>
              <BackButton
                onPress={() => setModalVisible(false)}
                disabled={canceling}
              >
                <CalcLabel color="white">Voltar</CalcLabel>
              </BackButton>
            </ModalFooter>
          </ModalCard>
        </ModalOverlay>
      </Modal>
    </Container>
  );
}
