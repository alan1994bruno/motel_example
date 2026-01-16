"use client";

import { AlertOctagon, MapPin, Wallet, ArrowRight } from "lucide-react";

import { Header } from "@/components/header/Header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SuitesSection } from "@/components/suites-section/SuitesSection";
import { LocationSection } from "@/components/location-section/LocationSection";
import { useCallback, useEffect, useState } from "react";
import { getPenalty } from "@/actions/penality";
import { Payment } from "@/types/penality.type";
import { format } from "date-fns"; // Para formatar a data
export default function PenaltyPage() {
  // 2. Estado para guardar os dados reais
  const [penalty, setPenalty] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  // Função para formatar dinheiro
  const formatMoney = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);

  // 3. Função que busca os dados
  const getPush = useCallback(async () => {
    try {
      const res = await getPenalty(); // Sua função de API
      console.log("Penalty Data from API:", JSON.stringify(res));

      // Se a API retornar dados, salvamos no estado
      if (res) {
        setPenalty(res);
      }
    } catch (error) {
      console.error("Erro ao buscar penalidade", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getPush();
  }, [getPush]);

  if (loading)
    return <div className="flex justify-center p-10">Carregando...</div>;

  // Se não tiver penalidade (null), pode mostrar uma mensagem de "Tudo certo"
  if (!penalty) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Nenhuma penalidade encontrada.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 flex flex-col py-12">
        <div className="flex flex-1 items-center justify-center">
          <Card className="w-full max-w-lg border-t-4 border-t-[#e11d48]">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <AlertOctagon className="w-8 h-8 text-[#e11d48]" />
              </div>
              <CardTitle className="text-2xl text-[#4c1d95] font-bold uppercase">
                Pendência Financeira
              </CardTitle>
              <CardDescription className="text-base">
                Identificamos uma penalidade em aberto no seu cadastro.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Valor da Dívida vindo do Servidor (price) */}
              <div className="bg-red-50 border border-red-100 rounded-lg p-6 text-center">
                <span className="text-gray-600 text-sm font-medium uppercase tracking-wide">
                  Valor a Regularizar
                </span>
                <div className="text-4xl font-extrabold text-[#e11d48] mt-2">
                  {formatMoney(penalty.price)}
                </div>

                {/* Data vinda do Servidor (createdAt) */}
                <p className="text-xs text-red-400 mt-2">
                  Gerada em: {format(new Date(penalty.createdAt), "dd/MM/yyyy")}
                  <br />
                  {/* Como o JSON não tem o nome da suíte, deixamos um texto padrão ou "Cancelamento" */}
                  Motivo: Cancelamento fora do prazo
                </p>
              </div>

              <Alert variant="destructive" className="bg-white border-red-200">
                <AlertOctagon className="h-4 w-4" />
                <AlertTitle>Reservas Bloqueadas</AlertTitle>
                <AlertDescription>
                  Você não poderá realizar novas reservas ou check-ins enquanto
                  esta pendência não for quitada.
                </AlertDescription>
              </Alert>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-[#4c1d95]" />
                  Como pagar?
                </h3>

                <div className="flex items-start gap-3 text-gray-600 bg-gray-50 p-4 rounded-md">
                  <MapPin className="w-6 h-6 text-[#4c1d95] shrink-0 mt-0.5" />
                  <div className="text-sm leading-relaxed">
                    <p className="font-bold text-gray-800 mb-1">
                      Pagamento Presencial
                    </p>
                    <p>
                      Para sua segurança, o pagamento deve ser realizado na{" "}
                      <strong>recepção do motel</strong>.
                    </p>
                    <p className="mt-2 text-xs text-gray-500">
                      Aceitamos cartões e Pix. Liberação imediata após
                      pagamento.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-center pb-8">
              <Button
                variant="outline"
                className="text-gray-500 border-gray-300 hover:bg-gray-100"
                asChild
              >
                <a href="/localizacao">
                  Ver Localização no Mapa{" "}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>
        <SuitesSection />
        <LocationSection />
      </main>
    </div>
  );
}
