"use client";

import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/logo";

export function LocationSection() {
  return (
    <section id="localizacao" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-primary uppercase mb-2 flex items-center justify-center gap-2">
            <MapPin className="w-8 h-8" />
            Localização
          </h2>
          <p className="text-gray-600">
            Fácil acesso e discrição total. Venha nos visitar.
          </p>
        </div>

        <div className="relative w-full h-map rounded-xl overflow-hidden shadow-lg border border-gray-200">
          <iframe
            src="https://www.google.com/maps/embed?..."
            width="100%"
            height="100%"
            className="absolute inset-0 w-full h-full object-cover border-0 grayscale-20"
            title="Localização do Motel - Feira de Santana, BA"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Card className="bg-white/95 backdrop-blur-sm p-8 shadow-2xl rounded-xl flex flex-col items-center justify-center border-t-4 border-t-primary min-w-[min-w-map]">
              <Logo />
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
