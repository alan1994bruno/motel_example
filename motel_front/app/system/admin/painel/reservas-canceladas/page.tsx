"use client";

import { useCallback, useEffect, useState } from "react"; // 1. React
import { getReservationCancelled } from "@/actions/reservation"; // 2. Actions
import { AdminHeader } from "@/components/admin-header"; // 3. Components
import { ReservationsTable } from "@/components/reservations-table"; // 3. Components
import type { ReservationData } from "@/components/reservations-table";

export default function CancelledReservationsPage() {
  const [totalReservations, setTotalReservations] = useState(0);
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const getCancelledReservations = useCallback(async () => {
    try {
      const res = await getReservationCancelled();
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
    getCancelledReservations();
  }, [getCancelledReservations]);

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
              {totalReservations}
            </span>
          </div>
        </div>

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
