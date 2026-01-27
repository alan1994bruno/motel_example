import axios from "axios";
import { useUserStore } from "@/store/user-store";

const baseURL = process.env.EXPO_PUBLIC_API_URL;

if (!baseURL) {
  console.error("ERRO CRÍTICO: A URL da API não foi definida no .env");
}

export const api = axios.create({
  baseURL: baseURL, // Troque pelo seu IP local ou URL de produção
  timeout: 10000,
});

// 2. Interceptor: Antes de cada requisição, pega o token do Zustand
api.interceptors.request.use(
  async (config) => {
    // Acessamos o estado fora de um componente React usando getState()
    const token = useUserStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
