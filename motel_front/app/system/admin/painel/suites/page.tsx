"use client";

import { AdminHeader } from "@/components/admin-header";
import { SuitesTable } from "@/components/suites-table";
import type { SuiteData } from "@/components/suites-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

// --- MOCK DE DADOS ---
const mockSuites: SuiteData[] = [
  { id: "1", name: "Suíte Self", price: 69.9, units: 5 },
  { id: "2", name: "Suíte Self Plus", price: 79.9, units: 3 },
  { id: "3", name: "Suíte Erótica", price: 99.9, units: 4 },
  { id: "4", name: "Suíte Nudes Hidro", price: 129.9, units: 2 },
  { id: "5", name: "Suíte Erótica Hidro", price: 139.9, units: 2 },
  { id: "6", name: "Suíte Erótica Hidro Plus", price: 159.9, units: 1 },
  { id: "7", name: "Suíte Duplex Hidro", price: 179.9, units: 2 },
  { id: "8", name: "Suíte Duplex Master", price: 299.9, units: 1 },
  // ... duplicando para testar paginação
  { id: "9", name: "Suíte Teste A", price: 50.0, units: 10 },
  { id: "10", name: "Suíte Teste B", price: 55.0, units: 8 },
  { id: "11", name: "Suíte Teste C", price: 60.0, units: 5 },
];

export default function SuitesPage() {
  const router = useRouter();

  const navigateToNewSuite = () => {
    router.push("/system/admin/painel/suites/nova");
  };

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
                {mockSuites.length}
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
        <SuitesTable data={mockSuites} />
      </main>
    </div>
  );
}
