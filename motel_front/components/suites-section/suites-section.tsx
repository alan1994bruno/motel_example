"use client";
import { getRooms } from "@/actions/rooms";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { Suites } from "@/components/suites-section";

export function SuitesSection() {
  const [suites, setSuites] = useState<Suites[]>([]);
  const router = useRouter();

  const pushRoom = useCallback(async () => {
    const data = await getRooms();
    if (data.length === 0) return;

    setSuites(
      data.map((room) => ({
        publicId: room.publicId,
        name: room.name,
        price: room.hourlyRate.toFixed(2),
        image: room.images[0]?.url,
      })),
    );
  }, []);

  const navigateRoom = useCallback((name: string) => {
    router.push(`/room/${name}`);
  }, []);

  useEffect(() => {
    pushRoom();
  }, [pushRoom]);

  return (
    <section id="suites" className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Cabeçalho da Seção */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#e11d48] uppercase mb-2">
            Suítes
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            Todas as acomodações possuem: <br className="hidden md:inline" />
            Ar-condicionado, ducha, frigobar e garagem privativa.
          </p>
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suites.map((suite, index) => (
            <div
              key={index}
              // 'group' no pai é essencial para ativar o hover nos filhos
              // 'overflow-hidden' impede que a imagem zoomada saia do card
              className="group relative h-64 md:h-72 w-full overflow-hidden rounded-sm shadow-md cursor-pointer"
            >
              {/* --- CAMADA DA IMAGEM COM ZOOM --- */}
              {/* Criamos um wrapper absoluto para a imagem que será o alvo da transformação */}
              <div className="absolute inset-0 h-full w-full transition-transform duration-500 ease-in-out group-hover:scale-110">
                <Image
                  src={suite.image}
                  alt={`Foto da ${suite.name}`}
                  fill // Ocupa todo o espaço do wrapper pai
                  className="object-cover" // Comportamento igual ao bg-cover
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Otimização para Next.js
                  priority={index < 3} // Carrega as primeiras imagens mais rápido
                />
                {/* Fallback escuro caso a imagem demore a carregar (opcional, o Image já lida bem com isso) */}
                <div className="absolute inset-0 bg-zinc-900 -z-10" />
              </div>

              {/* --- OVERLAY ESCURO --- */}
              {/* Fica sobre a imagem para garantir legibilidade do texto. Escurece levemente no hover. */}
              <div className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/60" />

              {/* --- CONTEÚDO DO CARD --- */}
              {/* 'relative z-10' garante que o texto e botão fiquem sobre a imagem e o overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-10">
                <h3 className="text-white text-2xl font-bold mb-1 drop-shadow-lg tracking-wide">
                  {suite.name}
                </h3>
                <p className="text-gray-100 text-sm mb-6 font-medium drop-shadow-md">
                  A partir de{" "}
                  <span className="font-extrabold text-white">
                    {suite.price}
                  </span>
                </p>

                <Button
                  className="bg-[#e11d48] hover:bg-[#be123c] text-white font-bold uppercase rounded-sm px-8 py-6 text-sm tracking-wider shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
                  onClick={() => navigateRoom(suite.publicId)}
                >
                  Ver Suíte
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
