"use client";
import { useState } from "react";
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
import { ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import { SuitesTableProps } from "@/components/suites-table/suites-table.type";

export function SuitesTable({ data }: SuitesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- PAGINAÇÃO ---
  const totalPages = Math.ceil(data.length / itemsPerPage);

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = data.slice(startIndex, endIndex);

  // --- SOMA DE UNIDADES (Capacidade total na página) ---
  const totalUnitsOnPage = currentItems.reduce(
    (acc, curr) => acc + curr.units,
    0,
  );

  // Formatador
  const formatMoney = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-md border shadow-sm">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="w-[300px] font-bold text-[#4c1d95]">
                Nome da Suíte
              </TableHead>
              <TableHead className="font-bold text-[#4c1d95]">
                Preço/hora
              </TableHead>
              <TableHead className="font-bold text-[#4c1d95] text-center">
                Unidades
              </TableHead>
              <TableHead className="text-right font-bold text-[#4c1d95]">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-gray-700">
                    {item.name}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {formatMoney(item.price)}
                  </TableCell>
                  <TableCell className="text-center font-bold text-gray-800 bg-gray-50 rounded-sm">
                    {item.units}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      onClick={() => console.log(`Editar suite ${item.id}`)}
                    >
                      <Pencil className="w-3 h-3 mr-2" />
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-gray-500"
                >
                  Nenhuma suíte cadastrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          {/* Rodapé somando as unidades disponíveis na visualização atual */}
          <TableFooter className="bg-gray-50 border-t-2 border-t-[#4c1d95]/20">
            <TableRow>
              <TableCell
                colSpan={2}
                className="text-right font-bold uppercase text-xs text-gray-500"
              >
                Total de Unidades (nesta página)
              </TableCell>
              <TableCell className="text-center font-extrabold text-[#4c1d95] text-lg">
                {totalUnitsOnPage}
              </TableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      {/* Controles de Paginação */}
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
