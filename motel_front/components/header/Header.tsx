"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/user-store";
import { clearCookie } from "@/lib/clear-cookie";

export function Header() {
  const router = useRouter();
  const email = useUserStore((state) => state.email);
  const clear = useUserStore((state) => state.clear);

  const onClickLogin = () => {
    router.push("/login");
  };

  const handleLogut = async () => {
    await clearCookie();
    clear();
    router.replace("/");
  };

  return (
    <header className="w-full bg-white py-4 shadow-sm border-b">
      <div className="container mx-auto flex items-center justify-between px-4 md:px-8">
        {/* 1. LOGO */}
        {/* Idealmente, você exportará o logo da imagem como SVG ou PNG e usará o componente <Image /> */}
        <div className="flex-shrink-0">
          <Link href="/" className="block">
            {/* Placeholder Visual para simular o logo da imagem */}
            <div className="relative group">
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

        {/* 2. NAVEGAÇÃO CENTRAL */}
        {/* Hidden em mobile, Flex em desktop (md) */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-bold text-[#4c1d95] uppercase hover:opacity-80 transition-opacity"
          >
            Início
          </Link>
          <Link
            href="#suites"
            className="text-sm font-bold text-[#4c1d95] uppercase hover:opacity-80 transition-opacity"
          >
            Nossas Suítes
          </Link>
          <Link
            href="#localizacao"
            className="text-sm font-bold text-[#4c1d95] uppercase hover:opacity-80 transition-opacity"
          >
            Localização
          </Link>
          {email && (
            <>
              <Link
                href="/minha-reserva"
                className="text-sm font-bold text-[#4c1d95] uppercase hover:opacity-80 transition-opacity"
              >
                Minha Reserva
              </Link>

              <Link
                href="/penalidade"
                className="text-sm font-bold text-[#4c1d95] uppercase hover:opacity-80 transition-opacity"
              >
                Penalidade
              </Link>
            </>
          )}
        </nav>

        {/* 3. BOTÃO DE AÇÃO (CTA) */}
        <div className="flex-shrink-0">
          <Button
            className="bg-[#5b21b6] hover:bg-[#4c1d95] text-white font-bold uppercase tracking-wide rounded-xl px-8 py-6 text-sm"
            onClick={!email ? onClickLogin : handleLogut}
          >
            {email ? `Logout` : "Login/Criar Conta"}
          </Button>
        </div>
      </div>
    </header>
  );
}
