import React from "react";
import { Tabs } from "expo-router";
import { BedDouble, CalendarCheck, AlertTriangle } from "lucide-react-native";
import { useTheme } from "styled-components/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform } from "react-native";

export default function TabLayout() {
  const theme = useTheme();

  //Pegue as medidas seguras do dispositivo atual
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#4c1d95",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb",
          backgroundColor: "#ffffff",
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
          marginBottom: Platform.OS === "ios" ? 0 : 4, // Ajuste fino para Android
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Suítes",
          tabBarIcon: ({ color, size }) => (
            <BedDouble color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="my-reserv"
        options={{
          title: "Minha Reserva",
          tabBarIcon: ({ color, size }) => (
            <CalendarCheck color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="penality"
        options={{
          title: "Penalidade",
          tabBarIcon: ({ color, size }) => (
            <AlertTriangle color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
