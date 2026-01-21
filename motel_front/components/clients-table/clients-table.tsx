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
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { ClientsTableProps } from "@/components/clients-table";

export function ClientsTable({
  data,
  totalClients,
  setCurrentPage,
  currentPage,
}: ClientsTableProps) {
  const itemsPerPage = 10;

  // Calcula o total de páginas baseado no total geral vindo do banco
  const totalPages = Math.ceil(totalClients / itemsPerPage);
  const router = useRouter();

  const handleEditClient = (clientId: string) => {
    router.push(`/system/admin/painel/clientes/${clientId}`);
  };

  // Contadores apenas visual
  const penalizedOnPage = data.filter((c) => c.isPenalized).length;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-md border shadow-sm">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="font-bold text-[#4c1d95]">
                Email do Cliente
              </TableHead>
              <TableHead className="w-[200px] font-bold text-[#4c1d95] text-center">
                Penalizado?
              </TableHead>
              <TableHead className="w-[100px] text-right font-bold text-[#4c1d95]">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium text-gray-700">
                    {client.email}
                  </TableCell>

                  <TableCell className="text-center">
                    {client.isPenalized ? (
                      <Badge
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700"
                      >
                        SIM
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 hover:bg-green-200"
                      >
                        NÃO
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      onClick={handleEditClient.bind(null, client.id)}
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
                  colSpan={3}
                  className="h-24 text-center text-gray-500"
                >
                  Nenhum cliente encontrado nesta página.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          <TableFooter className="bg-gray-50 border-t-2 border-t-[#4c1d95]/20">
            <TableRow>
              <TableCell className="text-right font-bold uppercase text-xs text-gray-500">
                Penalizados nesta página:
              </TableCell>
              <TableCell className="text-center font-extrabold text-[#e11d48] text-lg">
                {penalizedOnPage}
              </TableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      {/* Controles de Paginação */}
      {/* Só mostra paginação se houver dados ou se estivermos numa página > 1 */}
      <div className="flex items-center justify-end space-x-2">
        <div className="flex-1 text-sm text-muted-foreground">
          Página {currentPage} de {totalPages || 1}
        </div>
        <Button
          variant="outline"
          size="sm"
          // Garante que não vá para página 0 ou negativa
          onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="text-[#4c1d95] border-[#4c1d95]/20 hover:bg-[#4c1d95]/10"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          // Garante que não passe do total de páginas
          onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage >= totalPages}
          className="text-[#4c1d95] border-[#4c1d95]/20 hover:bg-[#4c1d95]/10"
        >
          Próxima
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
