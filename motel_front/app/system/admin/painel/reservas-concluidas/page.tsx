"use client";

import { useCallback, useEffect, useState } from "react"; // 1. React
import { getReservationCompleted } from "@/actions/reservation"; // 2. Actions
import { AdminHeader } from "@/components/admin-header"; // 3. Components
import { ReservationsTable } from "@/components/reservations-table"; // 3. Components
import type { ReservationData } from "@/components/reservations-table"; // 4. Types

export default function CompletedReservationsPage() {
  const [totalReservations, setTotalReservations] = useState(0);
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const getCompletedReservations = useCallback(async () => {
    try {
      const res = await getReservationCompleted();
      setTotalReservations(res.totalElements);
      setReservations(
        res.content.map((reservation) => ({
          id: reservation.publicId,
          suiteName: reservation.room.name,
          userEmail: reservation.user.email,
          price: reservation.room.hourlyRate,
          checkinTime: reservation.checkinTime,
          checkoutTime: reservation.checkoutTime,
          occupied: reservation.occupied,
        })),
      );
    } catch {}
  }, []);

  useEffect(() => {
    getCompletedReservations();
  }, [getCompletedReservations]);

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
              {totalReservations}
            </span>
          </div>
        </div>

        {/* Reutilizando a mesma Tabela */}
        <ReservationsTable
          data={reservations}
          totalItems={totalReservations}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </main>
    </div>
  );
}
