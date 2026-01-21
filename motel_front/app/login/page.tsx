import { Header } from "@/components/header/header";
import { AuthCard } from "@/components/auth-card";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center p-4">
        <AuthCard />
      </div>
    </main>
  );
}
