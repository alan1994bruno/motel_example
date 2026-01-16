"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react"; // Ícones para mostrar/esconder senha (opcional, mas recomendado)
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginUser } from "@/actions/login-user";
import { useUserStore } from "@/store/user-store";
import { useRouter } from "next/navigation";

const loginSchema = yup.object({
  email: yup.string().email("Email inválido").required("O email é obrigatório"),
  password: yup.string().required("A senha é obrigatória"),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

export default function AdminLoginPage() {
  const form = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const router = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    console.log("Login Data:", data);
    const result = await loginUser(data);

    console.log("Login Result:", result);
    if (result.success && result.data) {
      useUserStore.getState().setEmail(result.data); // salva no store
      router.replace("/system/admin/painel"); // redireciona para a página inicial
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      {/* CARD DE LOGIN */}
      {/* 'border-t-4 border-t-[#4c1d95]' cria a linha roxa no topo conforme a imagem */}
      <Card className="w-full max-w-[400px] shadow-xl border-t-4 border-t-[#4c1d95] bg-white">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl font-bold text-[#4c1d95]">
            Bem-vindo de volta
          </CardTitle>
          <CardDescription className="text-gray-500 text-base">
            Acesse sua conta para continuar.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Insira seu e-mail" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Insira sua senha"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-[#5b21b6] hover:bg-[#4c1d95] font-bold text-white uppercase mt-4"
              >
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
