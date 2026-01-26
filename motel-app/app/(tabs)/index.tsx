import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
} from "react-native";
import styled from "styled-components/native";
import { Header } from "@/components/header";
import { RoomType } from "@/@types/rooms";
import { getRooms } from "@/services/rooms";

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ContentPadding = styled.View`
  padding: 16px;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
`;

const Subtitle = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 20px;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

// Card Styles
const Card = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  margin-bottom: 20px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  elevation: 3;
`;

const SuiteImage = styled.Image`
  width: 100%;
  height: 220px;
  background-color: #e5e7eb;
`;

const CardBody = styled.View`
  padding: 16px;
`;

const SuiteHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

const SuiteName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  flex: 1;
`;

const PriceContainer = styled.View`
  align-items: flex-end;
`;

const PriceLabel = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textLight};
`;

const PriceValue = styled.Text`
  font-size: 20px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;

export default function HomeScreen() {
  const router = useRouter();

  // 1. ESTADOS PARA DADOS REAIS
  const [suites, setSuites] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 2. FUNÇÃO QUE BUSCA OS DADOS
  const fetchSuites = async () => {
    try {
      const data = await getRooms();
      setSuites(data);
    } catch (error) {
      console.error("Erro ao buscar quartos:", error);
      // Aqui você poderia mostrar um Alert ou Toast
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // 3. EFEITO INICIAL (Carrega ao abrir a tela)
  useEffect(() => {
    fetchSuites();
  }, []);

  // 4. FUNÇÃO DE PULL-TO-REFRESH
  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchSuites();
  }, []);

  if (isLoading) {
    return (
      <Container>
        <Header />
        <LoadingContainer>
          <ActivityIndicator size="large" color="#4c1d95" />
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <StatusBar />
      <Header />

      <FlatList
        data={suites}
        keyExtractor={(item) => String(item.id)} // Garante que a key seja string
        contentContainerStyle={{ paddingBottom: 20 }}
        // Adiciona o recurso de puxar para atualizar
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={["#4c1d95"]}
          />
        }
        ListHeaderComponent={
          <ContentPadding>
            <Title>Nossas Suítes</Title>
            <Subtitle>Escolha o conforto ideal para você</Subtitle>
          </ContentPadding>
        }
        ListEmptyComponent={
          <ContentPadding>
            <Subtitle style={{ textAlign: "center", marginTop: 20 }}>
              Nenhuma suíte encontrada no momento.
            </Subtitle>
          </ContentPadding>
        }
        renderItem={({ item }) => (
          <ContentPadding
            key={item.publicId}
            style={{ paddingTop: 0, paddingBottom: 0 }}
          >
            <Card
              onPress={() => router.push(`/suite/${item.publicId}`)}
              activeOpacity={0.9}
            >
              {/* Ajuste o campo da imagem conforme vem da sua API (ex: item.photo, item.image, item.url) */}
              <SuiteImage
                source={{
                  uri:
                    item.images[0].url ||
                    "https://via.placeholder.com/400x200?text=Sem+Imagem",
                }}
                resizeMode="cover"
              />
              <CardBody>
                <SuiteHeader>
                  <SuiteName>{item.name}</SuiteName>
                  <PriceContainer>
                    <PriceLabel>A partir de</PriceLabel>
                    <PriceValue>
                      R$ {item.hourlyRate?.toFixed(2).replace(".", ",")}
                    </PriceValue>
                  </PriceContainer>
                </SuiteHeader>
              </CardBody>
            </Card>
          </ContentPadding>
        )}
      />
    </Container>
  );
}
