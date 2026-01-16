"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { checkin } from "@/actions/reservation";

// Interface dos dados que a tabela espera receber
export interface ReservationData {
  id: string;
  suiteName: string;
  userEmail: string;
  price: number;
  checkinTime: string;
  checkoutTime: string;
  // Adicione outros campos se necessário (ex: status, data)
}

interface ReservationsTableProps {
  data: ReservationData[];
  isOccupied?: boolean;
  totalItems: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

function calculateDurationInHours(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);

  // A diferença vem em milissegundos
  const diffInMs = endDate.getTime() - startDate.getTime();

  // Converter: ms -> segundos -> minutos -> horas
  const hours = diffInMs / (1000 * 60 * 60);

  return hours;
}

export function ReservationsTable({
  data,
  isOccupied = false,
  totalItems,
  currentPage,
  setCurrentPage,
}: ReservationsTableProps) {
  const itemsPerPage = 10;

  // --- LÓGICA DE PAGINAÇÃO INTERNA ---
  // Calcula o número total de páginas baseado no tamanho do array recebido
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Garante que se os dados mudarem, a página não fique num índice inválido
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentItems = data.slice(startIndex, endIndex);

  // --- CÁLCULO DO TOTAL (Apenas da página visível) ---
  const pageTotal = currentItems.reduce((acc, curr) => acc + curr.price, 0);

  const handleOccupySuite = async (reservationId: string) => {
    console.log(`Ocupar suíte com ID: ${reservationId}`);
    await checkin(reservationId);
  };

  // Formatador
  const formatMoney = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);

  return (
    <div className="space-y-4">
      {/* Container da Tabela com bordas arredondadas */}
      <div className="bg-white rounded-md border shadow-sm">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="w-[300px] font-bold text-[#4c1d95]">
                Suíte
              </TableHead>
              <TableHead className="font-bold text-[#4c1d95]">
                Email do Cliente
              </TableHead>
              <TableHead className="text-right font-bold text-[#4c1d95]">
                Valor
              </TableHead>
              {/* 1. NOVA COLUNA DE AÇÕES */}
              {isOccupied && (
                <TableHead className="text-right font-bold text-[#4c1d95]">
                  Ações
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-gray-700">
                    {item.suiteName}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {item.userEmail}
                  </TableCell>
                  <TableCell className="text-right font-bold text-gray-800">
                    {formatMoney(
                      item.price *
                        calculateDurationInHours(
                          item.checkinTime,
                          item.checkoutTime
                        )
                    )}
                  </TableCell>

                  {/* 2. BOTÃO OCUPAR */}
                  {isOccupied && (
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        className="bg-[#4c1d95] hover:bg-[#3b1676] text-white font-bold"
                        onClick={handleOccupySuite.bind(null, item.id)}
                      >
                        Ocupar
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4} /* Ajustado para 4 colunas */
                  className="h-24 text-center text-gray-500"
                >
                  Nenhum registro encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          {/* 3. RODAPÉ AJUSTADO */}
          <TableFooter className="bg-gray-50 border-t-2 border-t-[#4c1d95]/20">
            <TableRow>
              <TableCell
                colSpan={2}
                className="text-right font-bold uppercase text-xs text-gray-500"
              >
                Total desta página
              </TableCell>
              <TableCell className="text-right font-extrabold text-[#4c1d95] text-lg">
                {formatMoney(pageTotal)}
              </TableCell>
              {/* Célula vazia para alinhar com a coluna do botão */}
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      {/* --- CONTROLES DE PAGINAÇÃO (Mantido igual) --- */}
      {data.length > 0 && (
        <div className="flex items-center justify-end space-x-2">
          <div className="flex-1 text-sm text-muted-foreground">
            Página {currentPage} de {totalPages || 1}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="text-[#4c1d95] border-[#4c1d95]/20 hover:bg-[#4c1d95]/10"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="text-[#4c1d95] border-[#4c1d95]/20 hover:bg-[#4c1d95]/10"
          >
            Próxima
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
