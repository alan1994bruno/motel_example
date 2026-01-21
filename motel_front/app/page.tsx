import { Header } from "@/components/header";
import { LocationSection } from "@/components/location-section";
import { SuitesSection } from "@/components/suites-section";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <SuitesSection />
      <LocationSection />
    </main>
  );
}
