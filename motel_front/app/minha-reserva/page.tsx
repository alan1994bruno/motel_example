"use client";

import Image from "next/image";
import { format, differenceInHours, addDays, set } from "date-fns";
import { ptBR, ro } from "date-fns/locale";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CalendarX,
  Clock,
  MapPin,
} from "lucide-react";

import { Header } from "@/components/header/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { use, useCallback, useEffect, useState } from "react";
import { cancelReservation, getMyReservation } from "@/actions/reservation";
import { ReservationSummary } from "@/types/reresvation.type";
import Link from "next/link";
import { SuitesSection } from "@/components/suites-section/SuitesSection";
import { useRouter } from "next/navigation";
import { LocationSection } from "@/components/location-section/LocationSection";

export default function ReservationPage() {
  const [reservation, setReservation] = useState<ReservationSummary | null>(
    null
  );

  // Estados derivados para controle da regra de negócio
  const [isPenaltyApplicable, setIsPenaltyApplicable] = useState(false);
  const [penaltyValue, setPenaltyValue] = useState(0);

  const router = useRouter();

  // 2. Função de busca e cálculo
  const getReservation = useCallback(async () => {
    try {
      const res: ReservationSummary = await getMyReservation();
      console.log("Fetched Reservation:", res); //

      if (res) {
        setReservation(res);

        // --- LÓGICA DE PENALIDADE COM DADOS REAIS ---
        // Precisamos converter a string ISO para Date para fazer a conta
        const checkInDate = new Date(res.checkinTime);
        const now = new Date();

        const hoursUntilCheckIn = differenceInHours(checkInDate, now);

        // Regra: Menos de 48h
        const applicable = hoursUntilCheckIn < 48;
        setIsPenaltyApplicable(applicable);

        // Regra: Valor total + 50% (metade)
        if (applicable) {
          setPenaltyValue(res.price * 1.5);
        } else {
          setPenaltyValue(0);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar reserva:", error);
    }
  }, []);

  useEffect(() => {
    getReservation();
  }, [getReservation]);

  const handleCancel = async () => {
    if (reservation) {
      await cancelReservation(reservation?.publicId);

      router.replace("/"); // Atualiza a página
    }
  };

  // Formatadores
  const formatMoney = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);

  if (!reservation) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="text-center space-y-6 max-w-md">
              {/* Ícone e Círculo de Fundo */}
              <div className="mx-auto w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
                <CalendarX className="w-12 h-12 text-[#4c1d95]" />
              </div>

              {/* Textos */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-800">
                  Você não possui reservas
                </h2>
                <p className="text-gray-500">
                  Que tal viver uma experiência inesquecível hoje? Confira
                  nossas suítes disponíveis.
                </p>
              </div>
            </div>
          </div>
          <SuitesSection />
          <LocationSection />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col gap-8">
        <div className="flex justify-center items-center">
          <Card className="w-full max-w-2xl shadow-xl border-t-4 border-t-[#4c1d95]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-[#4c1d95] uppercase font-bold">
                    Minha Reserva
                  </CardTitle>
                  <CardDescription>
                    Gerencie os detalhes do seu agendamento.
                  </CardDescription>
                </div>
                <Badge className="bg-green-600 hover:bg-green-700 text-white px-3 py-1">
                  {reservation.occupied ? "Ativa" : "Pendente"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Detalhes Principais */}
              <div className="flex flex-col md:flex-row gap-6">
                {/* Imagem da Suíte (Placeholder) */}
                <div className="w-full md:w-1/3 h-32 bg-gray-200 rounded-md overflow-hidden relative">
                  {/* Substitua por <Image /> real */}
                  <div className="absolute inset-0 bg-[#4c1d95]/10 flex items-center justify-center text-gray-500 text-xs">
                    {reservation ? (
                      <Image
                        src={reservation.room.images[0]?.url || ""}
                        alt="Foto da Suíte"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      "Foto da Suíte"
                    )}
                  </div>
                </div>

                {/* Infos */}
                <div className="flex-1 space-y-3">
                  <h3 className="font-bold text-xl text-gray-800">
                    Suíte {reservation ? reservation.room.name : ""}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-[#e11d48]" />
                      <span>
                        {format(reservation.checkinTime, "dd 'de' MMMM, yyyy", {
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#e11d48]" />
                      <span>
                        {format(reservation.checkinTime, "HH:mm")} às{" "}
                        {format(reservation.checkoutTime, "HH:mm")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:col-span-2">
                      <MapPin className="w-4 h-4 text-[#e11d48]" />
                      <span>Unidade Matriz - Feira de Santana</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Resumo Financeiro */}
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border">
                <span className="font-medium text-gray-700">
                  Valor Total da Reserva
                </span>
                <span className="text-2xl font-bold text-[#4c1d95]">
                  {formatMoney(reservation?.price || 0)}
                </span>
              </div>

              {/* Aviso de Penalidade VISUAL na tela */}
              <div className="bg-orange-50 border border-orange-200 rounded-md p-4 flex gap-3 text-orange-800 text-sm">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold mb-1">Política de Cancelamento</p>
                  <p>
                    Cancelamentos com <strong>menos de 2 dias (48h)</strong> de
                    antecedência estão sujeitos a uma multa. O valor cobrado
                    será o total da reserva acrescido de 50%.
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end pt-2">
              {/* MODAL DE CONFIRMAÇÃO (AlertDialog) */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="w-full md:w-auto bg-[#e11d48] hover:bg-[#be123c]"
                  >
                    Cancelar Reserva
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-[#e11d48]">
                      {isPenaltyApplicable
                        ? "Atenção: Penalidade Aplicável"
                        : "Confirmar Cancelamento"}
                    </AlertDialogTitle>

                    <AlertDialogDescription className="space-y-4 pt-2 text-gray-700">
                      {isPenaltyApplicable ? (
                        <>
                          <p>
                            Você está tentando cancelar com menos de 48 horas de
                            antecedência. Conforme nossa política, será cobrada
                            uma multa.
                          </p>
                          <div className="bg-red-50 p-3 rounded border border-red-100 mt-2">
                            <p className="flex justify-between text-sm">
                              <span>Valor Reserva:</span>
                              <span>
                                {formatMoney(reservation?.price || 0)}
                              </span>
                            </p>
                            <p className="flex justify-between text-sm text-red-600 font-bold mt-1">
                              <span>+ Multa (50%):</span>
                              <span>
                                {formatMoney(reservation?.price || 0 / 2)}
                              </span>
                            </p>
                            <div className="border-t border-red-200 my-2"></div>
                            <p className="flex justify-between font-extrabold text-lg text-[#e11d48]">
                              <span>Total a Pagar:</span>
                              <span>{formatMoney(penaltyValue)}</span>
                            </p>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Ao confirmar, você concorda com a cobrança imediata
                            deste valor.
                          </p>
                        </>
                      ) : (
                        <p>
                          Tem certeza que deseja cancelar sua reserva? Como
                          faltam mais de 48 horas,
                          <strong> não haverá cobrança de multa.</strong>
                        </p>
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Voltar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCancel}
                      className="bg-[#e11d48] hover:bg-[#be123c]"
                    >
                      {isPenaltyApplicable
                        ? "Aceitar Multa e Cancelar"
                        : "Confirmar Cancelamento"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        </div>
        <SuitesSection />
        <LocationSection />
      </main>
    </div>
  );
}
