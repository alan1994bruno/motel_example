"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { clearCookie } from "@/lib/clear-cookie";
import { useUserStore } from "@/store/user-store";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function AdminHeader() {
  const router = useRouter();
  const clear = useUserStore((state) => state.clear);
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    await clearCookie();
    clear();
    router.replace("/system/admin");
  };

  const baseLinkStyle =
    "bg-transparent text-xs font-bold text-[#4c1d95] uppercase hover:text-[#7c3aed] hover:bg-purple-50 data-[active]:bg-purple-50 data-[state=open]:bg-purple-50 transition-colors";

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
    <header className="w-full bg-white py-4 shadow-sm border-b border-gray-100 relative z-50">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="shrink-0 mr-4">
          <Link href="/system/admin/painel" className="block">
            <Logo />
          </Link>
        </div>

        {/* MENU DESKTOP */}
        <div className="hidden xl:block flex-1">
          <NavigationMenu viewport={isMobile}>
            <NavigationMenuList>
              {/* CORREÇÃO: Usando asChild em vez de legacyBehavior */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/system/admin/painel"
                    className={cn(navigationMenuTriggerStyle(), baseLinkStyle)}
                  >
                    Início
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn(baseLinkStyle)}>
                  Reservas
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-62.5 gap-2 p-4">
                    <ListItem
                      href="/system/admin/painel/reservas-ativas"
                      title="Reservas Ativas"
                    >
                      Gerenciamento em tempo real.
                    </ListItem>
                    <ListItem
                      href="/system/admin/painel/reservas-canceladas"
                      title="Reservas Canceladas"
                    >
                      Histórico de desistências.
                    </ListItem>
                    <ListItem
                      href="/system/admin/painel/reservas-concluidas"
                      title="Reservas Concluídas"
                    >
                      Histórico de finalizações.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/system/admin/painel/suites"
                    className={cn(navigationMenuTriggerStyle(), baseLinkStyle)}
                  >
                    Suítes
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/system/admin/painel/clientes"
                    className={cn(navigationMenuTriggerStyle(), baseLinkStyle)}
                  >
                    Clientes
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/system/admin/painel/clientes-penalizados"
                    className={cn(navigationMenuTriggerStyle(), baseLinkStyle)}
                  >
                    Clientes Penalizados
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* MENU MOBILE (Sheet) - Mantido igual pois já usa Link direto */}
        <div className="xl:hidden">
          <Sheet>
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
                <SheetClose asChild>
                  <Link
                    href="/system/admin/painel"
                    className="text-sm font-bold text-[#4c1d95] uppercase hover:text-[#7c3aed]"
                  >
                    Início
                  </Link>
                </SheetClose>

                <Accordion
                  type="single"
                  collapsible
                  className="w-full border-none"
                >
                  <AccordionItem value="reservas" className="border-b-0">
                    <AccordionTrigger className="py-0 text-sm font-bold text-[#4c1d95] uppercase hover:text-[#7c3aed] hover:no-underline">
                      Reservas
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-3 pt-3 pl-4">
                      <SheetClose asChild>
                        <Link
                          href="/system/admin/painel/reservas-ativas"
                          className="text-sm text-gray-600 hover:text-[#4c1d95]"
                        >
                          • Ativas
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/system/admin/painel/reservas-canceladas"
                          className="text-sm text-gray-600 hover:text-[#4c1d95]"
                        >
                          • Canceladas
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/system/admin/painel/reservas-concluidas"
                          className="text-sm text-gray-600 hover:text-[#4c1d95]"
                        >
                          • Concluídas
                        </Link>
                      </SheetClose>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <SheetClose asChild>
                  <Link
                    href="/system/admin/painel/suites"
                    className="text-sm font-bold text-[#4c1d95] uppercase hover:text-[#7c3aed]"
                  >
                    Suítes
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/system/admin/painel/clientes"
                    className="text-sm font-bold text-[#4c1d95] uppercase hover:text-[#7c3aed]"
                  >
                    Clientes
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/system/admin/painel/clientes-penalizados"
                    className="text-sm font-bold text-[#4c1d95] uppercase hover:text-[#7c3aed]"
                  >
                    Clientes Penalizados
                  </Link>
                </SheetClose>
              </div>

              <div className="mt-auto border-t pt-4">
                <Button
                  onClick={handleLogout}
                  className="w-full bg-[#5b21b6] hover:bg-[#4c1d95] text-white font-bold uppercase"
                >
                  Logout <LogOut className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden xl:flex shrink-0 ml-4">
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

const ListItem = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          href={href!}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-purple-50 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-bold leading-none text-[#4c1d95]">
            {title}
          </div>
          <p className="line-clamp-2 text-xs leading-snug text-gray-500 mt-1">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
