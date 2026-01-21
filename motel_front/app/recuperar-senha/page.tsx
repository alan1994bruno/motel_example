"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  ArrowLeft,
  Mail,
  Lock,
  Key,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { forgotPassword, resetPassword } from "@/actions/login-user";

// --- SCHEMAS DE VALIDAÇÃO ---

// Schema da Etapa 1 (Apenas Email)
const emailStepSchema = yup.object({
  email: yup.string().email("Email inválido").required("O email é obrigatório"),
});

// Schema da Etapa 2 (Código + Senhas)
const resetStepSchema = yup.object({
  code: yup.string().required("O código é obrigatório"),
  password: yup
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .required("Senha é obrigatória"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "As senhas não conferem")
    .required("Confirmação é obrigatória"),
});

export default function RecoverPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1); // Controla qual etapa está visível
  const [isLoading, setIsLoading] = useState(false);
  const [savedEmail, setSavedEmail] = useState("");

  // --- FORMS SETUP ---

  // Form da Etapa 1
  const formEmail = useForm({
    resolver: yupResolver(emailStepSchema),
    defaultValues: { email: "" },
  });

  // Form da Etapa 2
  const formReset = useForm({
    resolver: yupResolver(resetStepSchema),
    defaultValues: { code: "", password: "", confirmPassword: "" },
  });

  // --- HANDLERS ---

  // Enviar Email (Simulação)
  const onSubmitEmail = async (data: { email: string }) => {
    setIsLoading(true);
    // Aqui você chamaria API: await api.post('/auth/forgot-password', data)
    await forgotPassword(data.email);
    setSavedEmail(data.email);
    setIsLoading(false);
    setStep(2);
  };

  const onSubmitReset = async (data: { code: string; password: string }) => {
    try {
      setIsLoading(true);
      await resetPassword({ code: data.code, newPassword: data.password });
      alert("Senha alterada com sucesso!"); // Ou use um Toast
      router.push("/"); // Redireciona para a home conforme solicitado
    } catch (error) {
      alert("Erro ao redefinir senha. Verifique o código e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Reutilizando seu Header */}
      <Header />

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-t-4 border-t-[#4c1d95]">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-[#4c1d95]">
              {step === 1 ? "Recuperar Senha" : "Redefinir Senha"}
            </CardTitle>
            <CardDescription>
              {step === 1
                ? "Informe seu email para receber o código de verificação."
                : `Informe o código enviado para ${savedEmail} e sua nova senha.`}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* --- ETAPA 1: EMAIL --- */}
            {step === 1 && (
              <Form {...formEmail}>
                <form
                  onSubmit={formEmail.handleSubmit(onSubmitEmail)}
                  className="space-y-4"
                >
                  <FormField
                    control={formEmail.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-gray-700">
                          Email
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="seu@email.com"
                              className="pl-9 bg-gray-50 border-gray-200 focus-visible:ring-[#4c1d95]"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-[#4c1d95] hover:bg-[#3b1676] text-white font-bold h-12 mt-4"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Próximo"
                    )}
                  </Button>
                </form>
              </Form>
            )}

            {/* --- ETAPA 2: CÓDIGO E NOVA SENHA --- */}
            {step === 2 && (
              <Form {...formReset}>
                <form
                  onSubmit={formReset.handleSubmit(onSubmitReset)}
                  className="space-y-4"
                >
                  {/* Campo Código */}
                  <FormField
                    control={formReset.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-gray-700">
                          Código de Verificação
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Ex: 123456"
                              className="pl-9 bg-gray-50 border-gray-200 focus-visible:ring-[#4c1d95]"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Campo Nova Senha */}
                  <FormField
                    control={formReset.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-gray-700">
                          Nova Senha
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              type="password"
                              placeholder="••••••"
                              className="pl-9 bg-gray-50 border-gray-200 focus-visible:ring-[#4c1d95]"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Campo Repetir Senha */}
                  <FormField
                    control={formReset.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-gray-700">
                          Confirmar Senha
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <CheckCircle2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              type="password"
                              placeholder="••••••"
                              className="pl-9 bg-gray-50 border-gray-200 focus-visible:ring-[#4c1d95]"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-2 gap-3 flex flex-col">
                    <Button
                      type="submit"
                      className="w-full bg-[#4c1d95] hover:bg-[#3b1676] text-white font-bold h-12"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Trocar Senha"
                      )}
                    </Button>

                    {/* Botão para voltar para corrigir email se necessário */}
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setStep(1)}
                      className="text-sm text-gray-500 hover:text-[#4c1d95]"
                    >
                      Corrigir email
                    </Button>
                  </div>
                </form>
              </Form>
            )}

            {/* Link para voltar ao Login */}
            {step === 1 && (
              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="text-sm text-gray-500 hover:text-[#4c1d95] font-semibold flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Voltar para Login
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
