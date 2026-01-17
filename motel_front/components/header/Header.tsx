"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation"; // Importar usePathname
import { Button } from "@/components/ui/button";
import {
  Menu,
  LogOut,
  User,
  Home,
  Bed,
  MapPin,
  CalendarCheck,
  AlertTriangle,
} from "lucide-react";
import { useUserStore } from "@/store/user-store";
import { clearCookie } from "@/lib/clear-cookie";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  // SheetClose não será mais necessário pois controlaremos via estado
} from "@/components/ui/sheet";

export function Header() {
  const router = useRouter();
  const pathname = usePathname(); // Para saber em qual rota estamos
  const email = useUserStore((state) => state.email);
  const clear = useUserStore((state) => state.clear);
  const isMobile = useIsMobile();

  // 1. ESTADO PARA CONTROLAR O MENU MOBILE
  const [isOpen, setIsOpen] = React.useState(false);

  const onClickLogin = () => {
    setIsOpen(false); // Fecha o menu se estiver aberto
    router.push("/login");
  };

  const handleLogout = async () => {
    await clearCookie();
    clear();
    setIsOpen(false);
    router.replace("/");
  };

  // 2. FUNÇÃO MÁGICA PARA CORRIGIR O SCROLL
  const handleMobileScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    // Fecha o menu imediatamente
    setIsOpen(false);

    // Se o link for uma âncora (#) e estivermos na home
    if (href.includes("#")) {
      e.preventDefault(); // Previne o pulo instantâneo que falha
      const targetId = href.split("#")[1];

      // Se não estivermos na home, vamos para a home primeiro
      if (pathname !== "/") {
        router.push(href);
        return;
      }

      // Pequeno delay para garantir que o Sheet fechou e o body desbloqueou
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 300); // 300ms é o tempo da animação de saída do Sheet
    }
  };

  const baseLinkStyle =
    "bg-transparent text-sm font-bold text-[#4c1d95] uppercase hover:text-[#7c3aed] hover:bg-purple-50 data-[active]:bg-purple-50 transition-colors";

  const Logo = () => (
    <div className="relative group cursor-pointer w-fit">
      <h1
        className="text-4xl font-extrabold text-[#4c1d95] -rotate-6 tracking-tighter italic"
        style={{ fontFamily: "sans-serif" }}
      >
        Motel
      </h1>
      <div className="h-1 w-full bg-[#4c1d95] mt-1 rounded-full"></div>
      <div className="h-0.5 w-3/4 bg-[#4c1d95] mt-0.5 rounded-full ml-auto"></div>
    </div>
  );

  return (
    <header className="w-full bg-white py-4 shadow-sm border-b relative z-50">
      <div className="container mx-auto flex items-center justify-between px-4 md:px-8">
        <div className="shrink-0 mr-4">
          <Link href="/" className="block">
            <Logo />
          </Link>
        </div>

        {/* MENU DESKTOP */}
        <div className="hidden md:block flex-1">
          <NavigationMenu viewport={isMobile}>
            <NavigationMenuList className="justify-center">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/"
                    className={cn(navigationMenuTriggerStyle(), baseLinkStyle)}
                  >
                    Início
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/#suites"
                    className={cn(navigationMenuTriggerStyle(), baseLinkStyle)}
                  >
                    Nossas Suítes
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/#localizacao"
                    className={cn(navigationMenuTriggerStyle(), baseLinkStyle)}
                  >
                    Localização
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {email && (
                <>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/minha-reserva"
                        className={cn(
                          navigationMenuTriggerStyle(),
                          baseLinkStyle,
                        )}
                      >
                        Minha Reserva
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/penalidade"
                        className={cn(
                          navigationMenuTriggerStyle(),
                          baseLinkStyle,
                        )}
                      >
                        Penalidade
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* MENU MOBILE (Controlado via open={isOpen}) */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-[#4c1d95]">
                <Menu className="h-8 w-8" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-75 flex flex-col">
              <SheetHeader className="mb-6 text-left">
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-4 flex-1">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 text-sm font-bold text-[#4c1d95] uppercase hover:text-[#7c3aed] p-2 rounded-md hover:bg-purple-50"
                >
                  <Home className="w-4 h-4" /> Início
                </Link>

                <a
                  href="/#suites"
                  onClick={(e) => handleMobileScroll(e, "/#suites")}
                  className="flex items-center gap-3 text-sm font-bold text-[#4c1d95] uppercase hover:text-[#7c3aed] p-2 rounded-md hover:bg-purple-50 cursor-pointer"
                >
                  <Bed className="w-4 h-4" /> Nossas Suítes
                </a>

                <a
                  href="/#localizacao"
                  onClick={(e) => handleMobileScroll(e, "/#localizacao")}
                  className="flex items-center gap-3 text-sm font-bold text-[#4c1d95] uppercase hover:text-[#7c3aed] p-2 rounded-md hover:bg-purple-50 cursor-pointer"
                >
                  <MapPin className="w-4 h-4" /> Localização
                </a>

                {email && (
                  <>
                    <div className="h-px bg-gray-100 my-2" />
                    <Link
                      href="/minha-reserva"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 text-sm font-bold text-[#4c1d95] uppercase hover:text-[#7c3aed] p-2 rounded-md hover:bg-purple-50"
                    >
                      <CalendarCheck className="w-4 h-4" /> Minha Reserva
                    </Link>

                    <Link
                      href="/penalidade"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 text-sm font-bold text-[#e11d48] uppercase hover:text-[#be123c] p-2 rounded-md hover:bg-red-50"
                    >
                      <AlertTriangle className="w-4 h-4" /> Penalidade
                    </Link>
                  </>
                )}
              </div>

              <div className="mt-auto border-t pt-4">
                <Button
                  className="w-full bg-[#5b21b6] hover:bg-[#4c1d95] text-white font-bold uppercase py-6"
                  onClick={!email ? onClickLogin : handleLogout}
                >
                  {!email ? (
                    <>
                      <User className="w-4 h-4 mr-2" /> Login / Criar Conta
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4 mr-2" /> Logout (
                      {email.split("@")[0]})
                    </>
                  )}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden md:flex shrink-0 ml-4">
          <Button
            className="bg-[#5b21b6] hover:bg-[#4c1d95] text-white font-bold uppercase tracking-wide rounded-xl px-8 py-2 text-sm"
            onClick={!email ? onClickLogin : handleLogout}
          >
            {email ? "Logout" : "Login / Criar Conta"}
          </Button>
        </div>
      </div>
    </header>
  );
}
