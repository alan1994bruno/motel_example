"use client";

import * as React from "react";
import { AdminHeader } from "@/components/header/AdminHeader";
import {
  ReservationsTable,
  ReservationData,
} from "@/components/reservations-table/ReservationsTable";

// --- MOCK DE DADOS (Simulando Reservas Canceladas) ---
// Note que a estrutura é a mesma que a tabela espera
const mockCancelledReservations: ReservationData[] = Array.from({
  length: 15,
}).map((_, i) => ({
  id: `cancel-${i + 1}`,
  suiteName: i % 3 === 0 ? "Suíte Duplex Master" : "Suíte Self",
  userEmail: `cancelado${i + 1}@email.com`,
  price: i % 3 === 0 ? 299.9 : 69.9,
}));

export default function CancelledReservationsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminHeader />

      <main className="flex-1 container mx-auto p-8">
        {/* Cabeçalho da Seção */}
        <div className="flex items-center justify-between mb-6">
          <div>
            {/* Título em Vermelho para diferenciar visualmente de 'Ativas' (opcional, mas recomendado) */}
            <h2 className="text-2xl font-bold text-[#e11d48] uppercase">
              Reservas Canceladas
            </h2>
            <p className="text-gray-500 text-sm">Histórico de desistências</p>
          </div>

          <div className="text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-md shadow-sm border">
            Total Cancelado:{" "}
            <span className="font-bold text-[#e11d48]">
              {mockCancelledReservations.length}
            </span>
          </div>
        </div>

        {/* Reutilizando a mesma Tabela */}
        <ReservationsTable data={mockCancelledReservations} />
      </main>
    </div>
  );
}
