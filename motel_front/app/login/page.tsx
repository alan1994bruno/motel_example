// app/login/page.tsx
import { Header } from "@/components/header/Header"; // Seu header roxo
import { AuthCard } from "@/components/auth-card/AuthCard";

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
