import * as React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

// Interface para definir o que o componente espera receber
interface SuiteDetailCarouselProps {
  suiteName: string;
  images: string[]; // Array de caminhos das imagens
}

export function SuiteDetailCarousel({
  suiteName,
  images,
}: SuiteDetailCarouselProps) {
  return (
    <div className="w-full flex flex-col items-center py-8">
      {/* 1. TÍTULO DA SUÍTE */}
      {/* Cor vermelha e uppercase conforme o print e a identidade visual anterior */}
      <h1 className="text-3xl md:text-4xl font-bold text-[#e11d48] uppercase mb-8 tracking-wide">
        {suiteName}
      </h1>

      {/* 2. CARROSSEL */}
      <Carousel
        className="w-full max-w-4xl px-4 md:px-0" // Limita a largura em telas grandes
        opts={{
          loop: true, // Permite que o carrossel dê a volta completa
        }}
      >
        <CarouselContent>
          {images.map((src, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card className="border-0 shadow-none">
                  <CardContent className="flex aspect-video items-center justify-center p-0 overflow-hidden rounded-md relative">
                    {/* Imagem */}
                    <Image
                      src={src}
                      alt={`${suiteName} - Foto ${index + 1}`}
                      fill
                      className="object-cover"
                      priority={index === 0} // Carrega a primeira imagem mais rápido
                    />

                    {/* Overlay sutil para garantir contraste das setas (opcional) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* 3. SETAS DE NAVEGAÇÃO CUSTOMIZADAS */}
        {/* Posicionadas dentro da imagem (absolute) e estilizadas em branco */}
        <CarouselPrevious className="left-4 md:left-8 bg-transparent hover:bg-black/30 text-white border-2 border-white/50 hover:border-white h-12 w-12" />
        <CarouselNext className="right-4 md:right-8 bg-transparent hover:bg-black/30 text-white border-2 border-white/50 hover:border-white h-12 w-12" />
      </Carousel>

      {/* Indicador de quantidade (Opcional, mas útil para UX) */}
      <div className="mt-4 text-sm text-muted-foreground">
        Arraste para o lado ou use as setas para ver mais fotos
      </div>
    </div>
  );
}
