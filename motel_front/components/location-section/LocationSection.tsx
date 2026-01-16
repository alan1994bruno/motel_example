import * as React from "react";
import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";

export function LocationSection() {
  return (
    <section id="localizacao" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* 1. TÍTULO DA SEÇÃO */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#4c1d95] uppercase mb-2 flex items-center justify-center gap-2">
            <MapPin className="w-8 h-8" />
            Localização
          </h2>
          <p className="text-gray-600">
            Fácil acesso e discrição total. Venha nos visitar.
          </p>
        </div>

        {/* 2. ÁREA DO MAPA */}
        {/* 'relative' é essencial para posicionar o card do logo no centro */}
        <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-lg border border-gray-200">
          {/* MAPA (IFRAME) */}
          {/* Substitua o 'src' pelo link de embed do SEU endereço no Google Maps */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3899.087796071424!2d-38.9712345!3d-12.2415678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDE0JzI5LjYiUyAzOMKwNTgnMTYuNCJX!5e0!3m2!1spt-BR!2sbr!4v1600000000000!5m2!1spt-BR!2sbr"
            width="100%"
            height="100%"
            style={{ border: 0, filter: "grayscale(20%)" }} // Dica: grayscale deixa o mapa mais elegante
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* 3. CARD FLUTUANTE COM LOGO (Overlay) */}
          {/* Centralizado absolutamente sobre o mapa */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Card className="bg-white/95 backdrop-blur-sm p-8 shadow-2xl rounded-xl flex flex-col items-center justify-center border-t-4 border-t-[#4c1d95] min-w-[200px]">
              {/* LOGO (Reutilizando o estilo do Header) */}
              <div className="relative group">
                <h1
                  className="text-4xl font-extrabold text-[#4c1d95] -rotate-6 tracking-tighter italic"
                  style={{ fontFamily: "sans-serif" }}
                >
                  Motel
                </h1>
                <div className="h-1 w-full bg-[#4c1d95] mt-1 rounded-full"></div>
                <div className="h-0.5 w-3/4 bg-[#4c1d95] mt-0.5 rounded-full ml-auto"></div>
              </div>

              {/* Endereço Opcional abaixo do logo */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                  Unidade Matriz
                </p>
                <p className="text-xs text-gray-400">Feira de Santana - BA</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
