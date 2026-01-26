import { useRouter } from "expo-router";
import React from "react";
import { FlatList, StatusBar } from "react-native";
import styled from "styled-components/native";

// Imports da Raiz
import { Header } from "@/components/header";

const SUITES = [
  {
    id: "1",
    name: "Suíte Master",
    price: 120,
    image: "https://github.com/alan1994bruno/images/raw/master/Erotica/1.jpg",
  },
  {
    id: "2",
    name: "Suíte Erótica",
    price: 150,
    image: "https://github.com/alan1994bruno/images/raw/master/Erotica/2.jpg",
  },
];

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

// Card
const Card = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  margin-bottom: 20px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  /* Sombras sutis */
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

const SuiteImage = styled.Image`
  width: 100%;
  height: 220px; /* Imagens maiores ficam ótimas no mobile */
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

  return (
    <Container>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Header />

      <FlatList
        data={SUITES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListHeaderComponent={
          <ContentPadding>
            <Title>Nossas Suítes</Title>
            <Subtitle>Escolha o conforto ideal para você</Subtitle>
          </ContentPadding>
        }
        renderItem={({ item }) => (
          <ContentPadding style={{ paddingTop: 0, paddingBottom: 0 }}>
            <Card
              onPress={() => router.push(`/suite/${item.id}`)}
              activeOpacity={0.9}
            >
              <SuiteImage source={{ uri: item.image }} resizeMode="cover" />
              <CardBody>
                <SuiteHeader>
                  <SuiteName>{item.name}</SuiteName>
                  <PriceContainer>
                    <PriceLabel>A partir de</PriceLabel>
                    <PriceValue>
                      R$ {item.price.toFixed(2).replace(".", ",")}
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
