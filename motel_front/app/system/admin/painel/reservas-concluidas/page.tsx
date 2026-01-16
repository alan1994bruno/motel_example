"use client";

import * as React from "react";
import { AdminHeader } from "@/components/header/AdminHeader";
import {
  ReservationsTable,
  ReservationData,
} from "@/components/reservations-table/ReservationsTable";

// --- MOCK DE DADOS (Simulando Reservas já finalizadas) ---
const mockCompletedReservations: ReservationData[] = Array.from({
  length: 42,
}).map((_, i) => ({
  id: `done-${i + 1}`,
  suiteName: i % 4 === 0 ? "Suíte Erótica Hidro Plus" : "Suíte Self",
  userEmail: `concluido${i + 1}@email.com`,
  price: i % 4 === 0 ? 159.9 : 69.9,
}));

export default function CompletedReservationsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminHeader />

      <main className="flex-1 container mx-auto p-8">
        {/* Cabeçalho da Seção */}
        <div className="flex items-center justify-between mb-6">
          <div>
            {/* Título Verde para indicar sucesso/conclusão */}
            <h2 className="text-2xl font-bold text-green-600 uppercase">
              Reservas Concluídas
            </h2>
            <p className="text-gray-500 text-sm">
              Histórico de estadias finalizadas
            </p>
          </div>

          <div className="text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-md shadow-sm border">
            Total Concluído:{" "}
            <span className="font-bold text-green-600">
              {mockCompletedReservations.length}
            </span>
          </div>
        </div>

        {/* Reutilizando a mesma Tabela */}
        <ReservationsTable data={mockCompletedReservations} />
      </main>
    </div>
  );
}
