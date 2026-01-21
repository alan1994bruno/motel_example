"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { saveReservation } from "@/actions/reservation";
import { useRouter } from "next/navigation";
import type { BookingSectionProps } from "@/components/booking-section";

export function BookingSection({
  isLoggedIn,
  pricePerHour,
  suiteName,
  roomPublicId,
}: BookingSectionProps) {
  const [date, setDate] = React.useState<Date>();
  const [startHour, setStartHour] = React.useState<string>("");
  const [endHour, setEndHour] = React.useState<string>("");
  const router = useRouter();

  // --- REGRAS DE DATA ---
  const today = new Date();
  // Regra: Reservar com 3 dias de antecedência
  const minDate = addDays(today, 3);
  // Regra: Calendário mostra até 30 dias a partir da data de início permitida
  const maxDate = addDays(minDate, 30);

  // --- CÁLCULO DE TOTAL (Opcional, mas melhora UX) ---
  const totalHours =
    startHour && endHour ? parseInt(endHour) - parseInt(startHour) : 0;
  const totalPrice = totalHours > 0 ? totalHours * pricePerHour : 0;

  // --- GERAR OPÇÕES DE HORA ---
  // Hora cheia 0 até 23
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Filtra horas de saída baseadas na regra de MAX 6 horas e ser maior que a entrada
  const getEndHourOptions = () => {
    if (!startHour) return [];
    const start = parseInt(startHour);

    // Cria opções começando da próxima hora até (start + 6)
    // Nota: Se passar de 23h, assumimos que vira o dia, mas para simplificar o input 0-23
    // vamos travar no 23 ou permitir lógica de "próximo dia" se necessário.
    // Aqui assumirei que a reserva deve começar e terminar no mesmo "dia calendário" ou ciclo simples.
    // Se start=20, max end=2 (do dia seguinte). O input simples 0-23 pode confundir se virar o dia.
    // Vou limitar ao dia corrente (até 23h) ou mostrar (ex: 02:00 (+1)) se você quiser complexidade.
    // Pela sua descrição "0 até 23", vou assumir range simples.

    return hours.filter((h) => h > start && h <= start + 6);
  };

  const handleBooking = async () => {
    // Verificação de segurança (embora o botão só apareça se tudo estiver preenchido)
    if (!date || !startHour || !endHour) return;

    // 1. Criar cópias da data base selecionada para não alterar o estado original
    const dataEntrada = new Date(date);
    const dataSaida = new Date(date);

    // 2. Setar a hora (e zerar minutos/segundos)
    dataEntrada.setHours(parseInt(startHour), 0, 0, 0);
    dataSaida.setHours(parseInt(endHour), 0, 0, 0);

    // 3. Formatar para a string desejada: "2026-01-14T14:00:00"
    // O padrão 'yyyy-MM-dd\'T\'HH:mm:ss' garante exatamente esse output
    const checkinTime = format(dataEntrada, "yyyy-MM-dd'T'HH:mm:ss");
    const checkoutTime = format(dataSaida, "yyyy-MM-dd'T'HH:mm:ss");

    // Console log para você validar

    await saveReservation({
      roomPublicId,
      checkinTime,
      checkoutTime,
    });

    router.replace("/minha-reserva");

    // Aqui você faria o fetch/axios post
    // await api.post('/reservas', { ... })
  };

  return (
    <section className="py-12 bg-gray-50 flex justify-center px-4">
      <Card className="w-full max-w-lg shadow-xl border-t-4 border-t-[#e11d48]">
        <CardHeader>
          <CardTitle className="text-2xl text-[#4c1d95] font-bold uppercase">
            Reservar {suiteName}
          </CardTitle>
          <CardDescription>
            Planeje seu momento especial com antecedência.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* EXIBIÇÃO DO PREÇO */}
          <div className="bg-purple-50 p-4 rounded-lg flex items-center justify-between border border-purple-100">
            <span className="text-purple-900 font-medium">Valor por hora:</span>
            <span className="text-2xl font-bold text-[#e11d48]">
              R$ {pricePerHour.toFixed(2).replace(".", ",")}
            </span>
          </div>

          {!isLoggedIn ? (
            /* --- ESTADO: NÃO LOGADO --- */
            <div className="space-y-4 text-center py-6">
              <Alert
                variant="destructive"
                className="bg-red-50 border-red-200 text-red-800"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Você precisa estar logado para verificar disponibilidade.
                </AlertDescription>
              </Alert>

              <Button
                className="w-full bg-[#5b21b6] hover:bg-[#4c1d95] text-white font-bold py-6 uppercase"
                onClick={() => (window.location.href = "/login")} // Exemplo de redirecionamento
              >
                Login / Criar Conta para Reservar
              </Button>
            </div>
          ) : (
            /* --- ESTADO: LOGADO --- */
            <div className="space-y-4">
              {/* 1. SELETOR DE DATA */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Data da Reserva
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal h-12",
                        !date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? (
                        format(date, "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      locale={ptBR}
                      disabled={(date) =>
                        date < minDate ||
                        date > maxDate ||
                        date < new Date("1900-01-01")
                      }
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-gray-500">
                  *Reservas apenas entre {format(minDate, "dd/MM")} e{" "}
                  {format(maxDate, "dd/MM")} (3 dias de antecedência).
                </p>
              </div>

              {/* 2. SELETORES DE HORA */}
              <div className="grid grid-cols-2 gap-4">
                {/* Hora Entrada */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Entrada
                  </label>
                  <Select onValueChange={setStartHour} value={startHour}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="00h" />
                    </SelectTrigger>
                    <SelectContent>
                      {hours.map((h) => (
                        <SelectItem key={h} value={h.toString()}>
                          {h.toString().padStart(2, "0")}:00
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Hora Saída */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Saída
                  </label>
                  <Select
                    onValueChange={setEndHour}
                    value={endHour}
                    disabled={!startHour}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="00h" />
                    </SelectTrigger>
                    <SelectContent>
                      {getEndHourOptions().map((h) => (
                        <SelectItem key={h} value={h.toString()}>
                          {h.toString().padStart(2, "0")}:00
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* RESUMO E BOTÃO FINAL */}
              {date && startHour && endHour && (
                <div className="pt-4 border-t mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">
                      Total ({totalHours} horas):
                    </span>
                    <span className="text-xl font-bold text-[#e11d48]">
                      R$ {totalPrice.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  <Button
                    className="w-full bg-[#e11d48] hover:bg-[#be123c] text-white font-bold py-6 uppercase"
                    onClick={handleBooking}
                  >
                    Confirmar Reserva
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
