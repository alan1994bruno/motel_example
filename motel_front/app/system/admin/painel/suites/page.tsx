"use client";

import { getRoomsPage } from "@/actions/rooms";
import { AdminHeader } from "@/components/admin-header";
import { SuitesTable } from "@/components/suites-table";
import type { SuiteData } from "@/components/suites-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function SuitesPage() {
  const router = useRouter();
  const [room, setRooms] = useState<SuiteData[]>([]);
  const [totalClients, setTotalClients] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);

  const navigateToNewSuite = () => {
    router.push("/system/admin/painel/suites/nova");
  };

  const getData = useCallback(async () => {
    try {
      const data = await getRoomsPage(currentPage);
      console.log("data ", data);
      setRooms(
        data.content.map((it) => ({
          id: it.publicId,
          name: it.name,
          price: it.hourlyRate,
          units: it.units,
        })),
      );
      setTotalClients(data.totalElements);
    } catch {}
  }, []);

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminHeader />

      <main className="flex-1 container mx-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 uppercase">
              Gerenciar Suítes
            </h2>
            <p className="text-gray-500 text-sm">
              Controle de preços e disponibilidade
            </p>
          </div>

          <div className="flex gap-4">
            {/* Totalizador Simples */}
            <div className="text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-md shadow-sm border flex items-center">
              Total de Tipos:{" "}
              <span className="font-bold text-[#4c1d95] ml-1">
                {totalClients}
              </span>
            </div>

            {/* Botão para Adicionar Nova (Geralmente necessário nessa tela) */}
            <Button
              className="bg-[#4c1d95] hover:bg-[#3b1676]"
              onClick={navigateToNewSuite}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Suíte
            </Button>
          </div>
        </div>

        {/* Tabela de Suítes */}
        <SuitesTable
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          data={room}
          totalClients={totalClients}
        />
      </main>
    </div>
  );
}
