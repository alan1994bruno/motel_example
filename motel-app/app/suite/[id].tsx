import React, { useEffect, useState, useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
  Platform,
} from "react-native";
import styled from "styled-components/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  CheckCircle2,
} from "lucide-react-native";

// Serviços
import { getRoomByPublicId } from "@/services/rooms";
import { RoomType } from "@/@types/rooms";
import { saveReservation } from "@/services/reservation";
import { ReservationRequest } from "@/@types/reresvation";

// --- ESTILOS VISUAIS IDÊNTICOS AO MOCKUP ---

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const ScrollContent = styled.ScrollView`
  flex: 1;
  padding: 20px;
`;

const HeaderTitle = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #4c1d95; /* Roxo do título */
  margin-bottom: 8px;
  text-transform: uppercase;
`;

const Subtitle = styled.Text`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 24px;
`;

// Card Roxo Claro do Valor
const PriceCard = styled.View`
  background-color: #f3e8ff; /* Roxo bem clarinho */
  border-radius: 12px;
  padding: 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const PriceLabel = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #4c1d95;
`;

const PriceValue = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #dc2626; /* Vermelho do preço */
`;

const Label = styled.Text`
  font-size: 14px;
  color: #374151;
  margin-bottom: 8px;
  font-weight: 600;
`;

// Input simulando o campo de data
const InputTrigger = styled.TouchableOpacity`
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 14px;
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
  background-color: #fff;
`;

const InputText = styled.Text`
  font-size: 16px;
  color: #374151;
  margin-left: 10px;
`;

const WarningText = styled.Text`
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 24px;
`;

// Container lado a lado para Entrada/Saída
const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
`;

const Col = styled.View`
  flex: 1;
`;

// Dropdown simulado
const DropdownTrigger = styled.TouchableOpacity`
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 14px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
`;

// Rodapé com Total e Botão
const Footer = styled.View`
  margin-top: 20px;
  border-top-width: 1px;
  border-top-color: #e5e7eb;
  padding-top: 20px;
`;

const TotalRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const TotalLabel = styled.Text`
  font-size: 16px;
  color: #374151;
`;

const TotalValue = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #dc2626;
`;

const ConfirmButton = styled.TouchableOpacity`
  background-color: #dc2626; /* Botão Vermelho */
  padding: 16px;
  border-radius: 8px;
  align-items: center;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

const ButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
  text-transform: uppercase;
`;

// --- MODAL DE SELEÇÃO DE HORAS ---
const ModalOverlay = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: flex-end;
`;

const ModalContent = styled.View`
  background-color: #fff;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  max-height: 50%;
`;

const HourItem = styled.TouchableOpacity`
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #f3f4f6;
  align-items: center;
`;

export default function SuiteDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [suite, setSuite] = useState<RoomType | null>(null);
  const [loading, setLoading] = useState(true);

  // Estados do Formulário
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [entryHour, setEntryHour] = useState<string | null>(null); // "00", "01"...
  const [exitHour, setExitHour] = useState<string | null>(null); // "06", "07"...

  // Controle dos Modais de Hora
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Geração das horas "00:00" a "23:00"
  const hoursList = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const h = i.toString().padStart(2, "0");
      return { label: `${h}:00`, value: h };
    });
  }, []);

  // 1. Carregar Dados
  useEffect(() => {
    async function load() {
      try {
        const publicId = Array.isArray(id) ? id[0] : id;
        if (!publicId) return;
        const data = await getRoomByPublicId(publicId);
        setSuite(data);
      } catch (error) {
        Alert.alert("Erro", "Falha ao carregar.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  // 2. REGRA: Data Mínima (Hoje + 3 Dias)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 3);

  // 3. REGRA: Cálculo do Total
  const calculateTotal = () => {
    if (!entryHour || !exitHour || !suite?.hourlyRate) return 0;

    let start = parseInt(entryHour);
    let end = parseInt(exitHour);

    // Se saída for menor que entrada, assume dia seguinte (ex: Entra 22h, Sai 02h)
    let duration = end - start;
    if (duration <= 0) duration += 24;

    return duration * suite.hourlyRate;
  };

  const total = calculateTotal();
  const duration =
    !entryHour || !exitHour
      ? 0
      : parseInt(exitHour) - parseInt(entryHour) <= 0
        ? parseInt(exitHour) - parseInt(entryHour) + 24
        : parseInt(exitHour) - parseInt(entryHour);

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) setSelectedDate(date);
  };

  const handleReserve = async () => {
    if (!selectedDate || !entryHour || !exitHour || !suite) {
      Alert.alert(
        "Atenção",
        "Preencha a data e os horários de entrada e saída.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // 2. Construir os Objetos Date
      // Cria uma cópia da data selecionada para não alterar o state original
      const checkInDate = new Date(selectedDate);
      checkInDate.setHours(parseInt(entryHour), 0, 0, 0); // Hora escolhida, minuto 00

      const checkOutDate = new Date(selectedDate);
      checkOutDate.setHours(parseInt(exitHour), 0, 0, 0); // Hora escolhida, minuto 00

      // 3. Regra de Negócio: Virada de Dia
      // Se a hora de saída for menor ou igual à entrada (ex: Entra 23h, Sai 02h),
      // significa que é no dia seguinte. Adicionamos 1 dia.
      if (parseInt(exitHour) <= parseInt(entryHour)) {
        checkOutDate.setDate(checkOutDate.getDate() + 1);
      }

      // 4. Montar o Payload (ReservationRequest)
      const payload: ReservationRequest = {
        roomPublicId: suite.publicId as string, // Garante que é string/uuid
        checkinTime: checkInDate.toISOString(), // Converte para ISO 8601 (ex: 2026-01-30T14:00:00.000Z)
        checkoutTime: checkOutDate.toISOString(),
      };

      // 5. Chamar a API
      await saveReservation(payload);

      // 6. Sucesso
      Alert.alert("Sucesso", "Reserva realizada com sucesso!", [
        { text: "OK", onPress: () => router.push("/(tabs)/my-reserv") },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Erro",
        "Não foi possível realizar a reserva. Tente novamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Componente para renderizar a lista de horas
  const renderHourModal = (
    visible: boolean,
    onClose: () => void,
    onSelect: (h: string) => void,
  ) => (
    <Modal visible={visible} transparent animationType="slide">
      <ModalOverlay onPress={onClose}>
        <ModalContent>
          <FlatList
            data={hoursList}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <HourItem
                onPress={() => {
                  onSelect(item.value);
                  onClose();
                }}
              >
                <InputText>{item.label}</InputText>
              </HourItem>
            )}
          />
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );

  if (loading || !suite)
    return (
      <ActivityIndicator style={{ flex: 1 }} size="large" color="#4c1d95" />
    );

  return (
    <Container>
      <StatusBar style="dark" />
      <ScrollContent>
        {/* Título da Suíte (RESERVAR SELF PLUS) */}
        <HeaderTitle>RESERVAR {suite.name}</HeaderTitle>
        <Subtitle>Planeje seu momento especial com antecedência.</Subtitle>

        {/* Card de Valor (Valor por hora: R$ 30,00) */}
        <PriceCard>
          <PriceLabel>Valor por hora:</PriceLabel>
          <PriceValue>
            R$ {suite.hourlyRate?.toFixed(2).replace(".", ",")}
          </PriceValue>
        </PriceCard>

        {/* Data da Reserva */}
        <Label>Data da Reserva</Label>
        <InputTrigger onPress={() => setShowDatePicker(true)}>
          <CalendarIcon size={20} color="#6b7280" />
          <InputText>
            {selectedDate
              ? selectedDate.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "Selecione uma data"}
          </InputText>
        </InputTrigger>

        {/* Aviso de Antecedência */}
        <WarningText>
          *Reservas apenas a partir de {minDate.toLocaleDateString()} (3 dias de
          antecedência).
        </WarningText>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate || minDate}
            mode="date"
            minimumDate={minDate} // TRAVA: Regra de 3 dias
            display="default"
            onChange={handleDateChange}
          />
        )}

        {/* Linha de Entrada e Saída */}
        <Row>
          <Col>
            <Label>Entrada</Label>
            <DropdownTrigger onPress={() => setShowEntryModal(true)}>
              <InputText>{entryHour ? `${entryHour}:00` : "00:00"}</InputText>
              <ChevronDown size={20} color="#6b7280" />
            </DropdownTrigger>
          </Col>

          <Col>
            <Label>Saída</Label>
            <DropdownTrigger onPress={() => setShowExitModal(true)}>
              <InputText>{exitHour ? `${exitHour}:00` : "00:00"}</InputText>
              <ChevronDown size={20} color="#6b7280" />
            </DropdownTrigger>
          </Col>
        </Row>

        {/* Rodapé com Cálculo */}
        <Footer>
          <TotalRow>
            <TotalLabel>Total ({duration} horas):</TotalLabel>
            <TotalValue>R$ {total.toFixed(2).replace(".", ",")}</TotalValue>
          </TotalRow>

          <ConfirmButton
            onPress={handleReserve}
            disabled={total <= 0 || isSubmitting}
            style={{ opacity: total <= 0 || isSubmitting ? 0.6 : 1 }}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <ButtonText>CONFIRMAR RESERVA</ButtonText>
            )}
          </ConfirmButton>
        </Footer>
      </ScrollContent>

      {/* Modais de Seleção de Hora */}
      {renderHourModal(
        showEntryModal,
        () => setShowEntryModal(false),
        setEntryHour,
      )}
      {renderHourModal(
        showExitModal,
        () => setShowExitModal(false),
        setExitHour,
      )}
    </Container>
  );
}
