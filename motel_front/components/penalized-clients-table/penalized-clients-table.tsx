"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, AlertOctagon, Trash2 } from "lucide-react";
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
import { removePenalty } from "@/actions/penality";
import { useRouter } from "next/navigation";
import type { PenalizedClientsTableProps } from "@/components/penalized-clients-table/penalized-clients-table.types";

export function PenalizedClientsTable({
  data,
  totalClients,
  setCurrentPage,
  currentPage,
}: PenalizedClientsTableProps) {
  const itemsPerPage = 10;
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingId, setPendingId] = useState("");
  const [email, setEmail] = useState("");

  const totalPages = Math.ceil(data.length / itemsPerPage);

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = data.slice(startIndex, endIndex);

  const handleRemovePenalty = async (id: string, email: string) => {
    setPendingId(id);
    setEmail(email);
    setShowConfirm(true);
  };

  return (
    <>
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-4">
            <h3 className="font-bold text-lg mb-2">Confirmar remoção?</h3>
            <p className="text-gray-600 mb-6">
              Remover penalidade de <strong>{email}</strong>?
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowConfirm(false)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  setIsLoading(true);
                  await removePenalty(pendingId);
                  setIsLoading(false);
                  router.refresh();
                  setShowConfirm(false);
                }}
              >
                {isLoading ? "Removendo..." : "Remover"}
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-4">
        <div className="bg-white rounded-md border shadow-sm border-l-4 border-l-red-500">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="font-bold text-[#4c1d95]">
                  Email do Cliente
                </TableHead>
                <TableHead className="w-30 font-bold text-[#4c1d95] text-center">
                  Status
                </TableHead>
                <TableHead className="w-30 text-right font-bold text-[#4c1d95]">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.length > 0 ? (
                currentItems.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium text-gray-700 flex items-center gap-2">
                      <AlertOctagon className="w-4 h-4 text-red-500" />
                      {client.email}
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700 uppercase"
                      >
                        Penalizado
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                        onClick={() =>
                          handleRemovePenalty(
                            client.penalty.publicId,
                            client.email,
                          )
                        }
                      >
                        <Trash2 className="w-3 h-3 mr-2" />
                        Remover
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
                    Nenhum cliente penalizado no momento.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>

            <TableFooter className="bg-gray-50 border-t-2 border-t-[#4c1d95]/20">
              <TableRow>
                <TableCell className="text-right font-bold uppercase text-xs text-gray-500">
                  Total nesta página:
                </TableCell>
                <TableCell className="text-center font-extrabold text-[#e11d48] text-lg">
                  {currentItems.length}
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
    </>
  );
}
