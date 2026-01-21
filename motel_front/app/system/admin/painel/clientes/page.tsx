"use client";

import { AdminHeader } from "@/components/admin-header";
import { ClientsTable } from "@/components/clients-table";
import type { ClientData } from "@/components/clients-table";
import { getUsersClient } from "@/actions/user";
import { useCallback, useEffect, useState } from "react";

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [totalClients, setTotalClients] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);

  const getClient = useCallback(async () => {
    console.log("Clientes corrente:", currentPage);
    const result = await getUsersClient(currentPage);
    console.log("Clientes recebidos da API:", result);
    const convert = result.content.map((user) => ({
      id: user.publicId,
      email: user.email,
      isPenalized: !!user.penalty,
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
            <h2 className="text-2xl font-bold text-gray-800 uppercase">
              Gerenciar Clientes
            </h2>
            <p className="text-gray-500 text-sm">
              Base de usuários cadastrados
            </p>
          </div>

          <div className="text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-md shadow-sm border">
            Total de Clientes:{" "}
            <span className="font-bold text-[#4c1d95]">{totalClients}</span>
          </div>
        </div>

        {/* Tabela de Clientes */}
        <ClientsTable
          data={clients}
          totalClients={totalClients}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </main>
    </div>
  );
}
