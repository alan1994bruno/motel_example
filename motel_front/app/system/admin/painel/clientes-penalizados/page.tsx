"use client";

import { AdminHeader } from "@/components/admin-header";
import { PenalizedClientsTable } from "@/components/penalized-clients-table";
import type { PenalizedClientData } from "@/components/penalized-clients-table";
import { getUserClientPenalized } from "@/actions/user";
import { useCallback, useEffect, useState } from "react";

export default function PenalizedClientsPage() {
  const [clients, setClients] = useState<PenalizedClientData[]>([]);
  const [totalClients, setTotalClients] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);

  const getClient = useCallback(async () => {
    console.log("Clientes corrente:", currentPage);
    const result = await getUserClientPenalized(currentPage);
    console.log("Clientes recebidos da API:", result);
    const convert = result.content.map((user) => ({
      id: user.publicId,
      email: user.email,
      penalty: user.penalty,
    }));
    console.log("Clientes convertidos:", convert);
    setClients(convert);
    setTotalClients(result.totalElements);
  }, [currentPage]);

  useEffect(() => {
    getClient();
  }, [getClient]);

  console.log("Total de clientes:", totalClients, currentPage, clients);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminHeader />

      <main className="flex-1 container mx-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#e11d48] uppercase">
              Clientes Penalizados
            </h2>
            <p className="text-gray-500 text-sm">
              Usuários com pendências financeiras ou bloqueios
            </p>
          </div>

          <div className="text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-md shadow-sm border border-red-100">
            Total Bloqueado:{" "}
            <span className="font-bold text-[#e11d48]">{totalClients}</span>
          </div>
        </div>

        {/* Tabela Específica */}
        <PenalizedClientsTable
          totalClients={totalClients}
          data={clients}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </main>
    </div>
  );
}
