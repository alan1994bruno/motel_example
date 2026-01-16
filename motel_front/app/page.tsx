import { Header } from "@/components/header/Header";
import { LocationSection } from "@/components/location-section/LocationSection";
import { SuitesSection } from "@/components/suites-section/SuitesSection";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <SuitesSection />
      <LocationSection />
    </main>
  );
}
