"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function AdminHeader() {
  const router = useRouter();

  const handleLogout = () => {
    // Aqui você limpará os cookies/tokens de autenticação
    console.log("Logout realizado");
    router.replace("/system/admin/painel");
  };

  return (
    <header className="w-full bg-white py-4 shadow-sm border-b border-gray-100">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* 1. LOGO */}
        <div className="flex-shrink-0">
          <Link href="/system/admin/painel" className="block">
            {/* Simulação do Logo Visual */}
            <div className="relative group cursor-pointer">
              <h1
                className="text-4xl font-extrabold text-[#4c1d95] -rotate-6 tracking-tighter italic"
                style={{ fontFamily: "sans-serif" }}
              >
                Motel
              </h1>
              <div className="h-1 w-full bg-[#4c1d95] mt-1 rounded-full"></div>
              <div className="h-0.5 w-3/4 bg-[#4c1d95] mt-0.5 rounded-full ml-auto"></div>
            </div>
          </Link>
        </div>

        {/* 2. NAVEGAÇÃO CENTRAL (Desktop) */}
        {/* Baseado no menu.png */}
        <nav className="hidden xl:flex items-center gap-6">
          <Link
            href="painel"
            className="text-xs font-bold text-[#4c1d95] uppercase hover:text-[#7c3aed] transition-colors"
          >
            Início
          </Link>
          <Link
            href="/system/admin/painel/reservas-ativas"
            className="text-xs font-bold text-[#4c1d95] uppercase hover:text-[#7c3aed] transition-colors"
          >
            Reservas Ativas
          </Link>
          <Link
            href="/system/admin/painel/reservas-canceladas"
            className="text-xs font-bold text-[#4c1d95] uppercase hover:text-[#7c3aed] transition-colors"
          >
            Reservas Canceladas
          </Link>
          <Link
            href="/system/admin/painel/reservas-concluidas"
            className="text-xs font-bold text-[#4c1d95] uppercase hover:text-[#7c3aed] transition-colors"
          >
            Reservas Concluídas
          </Link>
          <Link
            href="/system/admin/painel/suites"
            className="text-xs font-bold text-[#4c1d95] uppercase hover:text-[#7c3aed] transition-colors"
          >
            Suítes
          </Link>
          <Link
            href="/system/admin/painel/clientes"
            className="text-xs font-bold text-[#4c1d95] uppercase hover:text-[#7c3aed] transition-colors"
          >
            Clientes
          </Link>
          <Link
            href="/system/admin/painel/clientes-penalizados"
            className="text-xs font-bold text-[#4c1d95] uppercase hover:text-[#7c3aed] transition-colors"
          >
            Clientes Penalizados
          </Link>
        </nav>

        {/* 3. BOTÃO DE LOGOUT */}
        <div className="flex-shrink-0">
          <Button
            onClick={handleLogout}
            className="bg-[#5b21b6] hover:bg-[#4c1d95] text-white font-bold uppercase tracking-wide rounded-xl px-8 py-2 text-sm flex items-center gap-2"
          >
            Logout
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
