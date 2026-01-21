import { AdminHeader } from "@/components/admin-header";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header com Menu Administrativo */}
      <AdminHeader />

      {/* Conteúdo do Painel */}
      <main className="flex-1 container mx-auto p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Painel Administrativo
          </h2>
          <p className="text-gray-500">Bem-vindo ao sistema de gestão.</p>
        </div>

        {/* Aqui entrará o conteúdo (Dashboards, tabelas, etc) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Exemplo de Cards de Resumo */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-500 text-sm uppercase">
              Reservas Hoje
            </h3>
            <p className="text-3xl font-bold text-[#4c1d95]">12</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-500 text-sm uppercase">
              Suítes Ocupadas
            </h3>
            <p className="text-3xl font-bold text-[#e11d48]">5</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-500 text-sm uppercase">
              Faturamento (Dia)
            </h3>
            <p className="text-3xl font-bold text-green-600">R$ 1.250,00</p>
          </div>
        </div>
      </main>
    </div>
  );
}
